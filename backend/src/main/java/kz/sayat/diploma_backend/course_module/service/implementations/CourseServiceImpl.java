package kz.sayat.diploma_backend.course_module.service.implementations;


import com.itextpdf.text.*;
import com.itextpdf.text.log.Logger;
import com.itextpdf.text.log.LoggerFactory;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.transaction.Transactional;
import kz.sayat.diploma_backend.auth_module.dto.StudentDto;
import kz.sayat.diploma_backend.auth_module.mapper.StudentMapper;
import kz.sayat.diploma_backend.auth_module.models.Student;
import kz.sayat.diploma_backend.auth_module.models.enums.UserRole;
import kz.sayat.diploma_backend.auth_module.repository.StudentRepository;
import kz.sayat.diploma_backend.auth_module.service.StudentService;
import kz.sayat.diploma_backend.auth_module.service.TeacherService;
import kz.sayat.diploma_backend.course_module.dto.CourseSummaryDto;
import kz.sayat.diploma_backend.course_module.dto.ModuleDto;
import kz.sayat.diploma_backend.course_module.dto.QuizSummaryDto;
import kz.sayat.diploma_backend.course_module.models.Enrollment;
import kz.sayat.diploma_backend.course_module.models.EnrollmentId;
import kz.sayat.diploma_backend.course_module.models.enums.CourseCategory;
import kz.sayat.diploma_backend.course_module.repository.EnrollmentRepository;
import kz.sayat.diploma_backend.course_module.repository.ModuleRepository;
import kz.sayat.diploma_backend.course_module.service.CourseService;
import kz.sayat.diploma_backend.quiz_module.models.Quiz;
import kz.sayat.diploma_backend.quiz_module.models.QuizAttempt;
import kz.sayat.diploma_backend.quiz_module.repository.QuizAttemptRepository;
import kz.sayat.diploma_backend.quiz_module.repository.QuizRepository;
import kz.sayat.diploma_backend.util.exceptions.ResourceNotFoundException;
import kz.sayat.diploma_backend.course_module.dto.CourseDto;
import kz.sayat.diploma_backend.course_module.models.Course;
import kz.sayat.diploma_backend.auth_module.models.Teacher;
import kz.sayat.diploma_backend.auth_module.models.User;
import kz.sayat.diploma_backend.course_module.mapper.CourseMapper;
import kz.sayat.diploma_backend.course_module.repository.CourseRepository;
import kz.sayat.diploma_backend.auth_module.repository.TeacherRepository;
import kz.sayat.diploma_backend.auth_module.security.MyUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import kz.sayat.diploma_backend.course_module.models.Module;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseMapper mapper;
    private final TeacherRepository teacherRepository;
    private final StudentService studentService;
    private final TeacherService teacherService;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final StudentMapper studentMapper;
    private final ModuleRepository moduleRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    @Override
    @PreAuthorize("hasRole('TEACHER')")
    public CourseDto createCourse(CourseDto dto, Authentication authentication) {

        Course course = mapper.toCourse(dto);

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        Teacher teacher = teacherRepository.findById(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        course.setTeacher(teacher);

        return courseMapper.toCourseDto(courseRepository.save(course));
    }


    @Override
    public CourseDto findCourseById(int id, Authentication auth) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        boolean isEnrolled = false;
        boolean isTeacher = false;
        Integer authenticatedStudentId = null;
        Student authenticatedStudent = null;

        if (auth != null && auth.isAuthenticated()) {
            MyUserDetails userDetails = (MyUserDetails) auth.getPrincipal();
            UserRole role = userDetails.getUser().getRole();

            if (role == UserRole.STUDENT) {
                authenticatedStudent = studentService.getStudentFromUser(auth);
                authenticatedStudentId = authenticatedStudent.getId();
                isEnrolled = enrollmentRepository.existsByStudentAndCourse(authenticatedStudent, course);
            } else if (role == UserRole.TEACHER) {
                Teacher authenticatedTeacher = teacherService.getTeacherFromUser(auth);
                isTeacher = course.getTeacher().getId() == authenticatedTeacher.getId();
            }
        }

        CourseDto courseDto = mapper.toCourseDto(course);
        courseDto.setEnrolled(isEnrolled);
        courseDto.setCreator(isTeacher);

        if (authenticatedStudentId != null) {
            for (ModuleDto moduleDto : courseDto.getModules()) {
                double progress = calculateModuleProgress(authenticatedStudentId, moduleDto.getId());
                moduleDto.setProgress(progress);

                for (QuizSummaryDto quizSummary : moduleDto.getQuizzes()) {
                    Quiz quiz = quizRepository.findById(quizSummary.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
                    QuizAttempt latestAttempt = quizAttemptRepository
                        .findTopByStudentAndQuizOrderByAttemptNumberDesc(authenticatedStudent, quiz);
                    quizSummary.setPassed(latestAttempt != null && latestAttempt.isPassed());
                }
            }
        } else {
            courseDto.getModules().forEach(module -> {
                module.setProgress(0);
                module.getQuizzes().forEach(quiz -> quiz.setPassed(false)); // Явно устанавливаем passed: false
            });
        }

        return courseDto;
    }




    @Override
    public void enrollCourse(int courseId, Authentication authentication) {
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        if (!(user instanceof Student student)) {
            throw new RuntimeException("User is not a student");
        }

        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        EnrollmentId enrollmentId = new EnrollmentId(student.getId(), course.getId());

        if (enrollmentRepository.existsById(enrollmentId)) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment(enrollmentId, student, course, false);
        enrollmentRepository.save(enrollment);
    }


    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<CourseSummaryDto> getAllCourses() {
        List<Course> courses=courseRepository.findAll();
        return courseMapper.toCourseSummaryDtoList(courses);
    }

    @Override
    @PreAuthorize("hasRole('TEACHER') or ('ADMIN')")
    public List<StudentDto> getStudentForCourse(int id) {
        List<Student> students = enrollmentRepository.findStudentsByCourseId(id);
        return studentMapper.toStudentDtoList(students);
    }

    @Override
    public List<CourseSummaryDto> getMyCourses(Authentication authentication) {
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        if (!(user instanceof Student student)) {
            throw new RuntimeException("User is not a student");
        }

        List<Course> courses = enrollmentRepository.findCoursesByStudentId(student.getId())
            .stream()
            .filter(course -> course.isPublic() && !isCourseCompleted(student.getId(), course.getId())) // Исключаем завершенные
            .toList();

        return courses.stream()
            .map(course -> {
                CourseSummaryDto dto = courseMapper.toCourseSummaryDto(course);
                double progress = calculateCourseProgress(student.getId(), course.getId());
                dto.setProgress(progress);
                return dto;
            })
            .collect(Collectors.toList());
    }

    public boolean isCourseCompleted(int studentId, int courseId) {
        List<Module> modules = moduleRepository.findByCourseId(courseId);

        if (modules.isEmpty()) {
            return false;
        }

        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        for (Module module : modules) {
            List<Quiz> quizzes = quizRepository.findQuizzesByModule_Id(module.getId());

            if (!quizzes.isEmpty()) {
                boolean allQuizzesPassed = quizzes.stream()
                    .map(quiz -> quizAttemptRepository.findTopByStudentAndQuizOrderByAttemptNumberDesc(student, quiz))
                    .allMatch(attempt -> attempt != null && attempt.isPassed());

                if (!allQuizzesPassed) {
                    return false;
                }
            }
        }

        return true;
    }

    public void updateEnrollmentStatus(int studentId, int courseId) {
        Enrollment enrollment = enrollmentRepository.findById(new EnrollmentId(studentId, courseId))
            .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

        if (isCourseCompleted(studentId, courseId)) {
            enrollment.setCompleted(true);
            enrollmentRepository.save(enrollment);
        }
    }



    public double calculateCourseProgress(int studentId, int courseId) {
        List<Module> modules = moduleRepository.findByCourseId(courseId);
        double totalProgress = 0;
        int totalModules = modules.size();

        for (Module module : modules) {
            totalProgress += calculateModuleProgress(studentId, module.getId());
        }

        double progress = totalModules == 0 ? 0 : totalProgress / totalModules;

        // Check if the student has completed the course
        updateEnrollmentStatus(studentId, courseId);

        return progress;
    }


    public double calculateModuleProgress(int studentId, int moduleId) {
        int totalQuizzes = quizRepository.countByModuleId(moduleId);

        if (totalQuizzes == 0) {
            return 100.0;
        }

        List<Quiz> quizzes = quizRepository.findQuizzesByModule_Id(moduleId);

        double totalScore = 0;

        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        for (Quiz quiz : quizzes) {
            QuizAttempt lastAttempt = quizAttemptRepository.findTopByStudentAndQuizOrderByAttemptNumberDesc(student, quiz);

            if (lastAttempt != null && lastAttempt.isPassed()) {
                totalScore += lastAttempt.getScore();
            }
        }

        return totalScore / totalQuizzes;
    }


    @Override
    @PreAuthorize("hasRole('TEACHER')")
    public void deleteCourse(int id) {
        courseRepository.deleteById(id);
    }

    @Override
    public List<CourseSummaryDto> getCoursesByQuery(String query) {
        List<Course> courses;
        if (query == null || query.trim().isEmpty()) {
            courses = courseRepository.findByIsPublicTrue();
        } else {
            courses = courseRepository.findByIsPublicTrueAndTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
        }
        return courseMapper.toCourseSummaryDtoList(courses);
    }

    @Override
    public List<CourseSummaryDto> getCoursesByCategory(List<String> selectedCategoryNames) {
        if (selectedCategoryNames == null || selectedCategoryNames.isEmpty()) {
            throw new IllegalArgumentException("At least one category name must be provided");
        }

        Set<String> tags = selectedCategoryNames.stream()
                .map(name -> {
                    try {
                        return CourseCategory.valueOf(name);
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Invalid category name: " + name);
                    }
                })
                .flatMap(category -> category.getTags().stream())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        Set<Course> matchingCourses = new HashSet<>();
        for (String tag : tags) {
            List<Course> courses = courseRepository
                    .findByIsPublicTrueAndTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(tag, tag);
            matchingCourses.addAll(courses);
        }

        return courseMapper.toCourseSummaryDtoList(new ArrayList<>(matchingCourses));
    }


    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void approve(int id) {
        Course course= courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        course.setPublic(true);
    }

    @Override
    public List<CourseSummaryDto> getPrivateCourses() {
        List<Course> courses= courseRepository.findByIsPublicFalse();
        return courseMapper.toCourseSummaryDtoList(courses);
    }

    @Override
    public void disallow(int id) {
        Course course= courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        course.setPublic(false);
    }

    @Override
    public void editCourse(CourseDto dto, int id) {
        Course course= courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
    }

    @Override
    public List<CourseSummaryDto> getCompletedCourses(Authentication authentication) {
        Student student = studentRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Course> courses = enrollmentRepository.findCoursesByStudentId(student.getId());

        return courses.stream()
            .filter(course -> {
                boolean completed = isCourseCompleted(student.getId(), course.getId());
                if (completed) {
                    updateEnrollmentStatus(student.getId(), course.getId());
                }
                return completed;
            })
            .map(course -> {
                CourseSummaryDto dto = courseMapper.toCourseSummaryDto(course);
                double progress = calculateCourseProgress(student.getId(), course.getId());
                dto.setProgress(progress);
                return dto;
            })
            .collect(Collectors.toList());
    }

    @Override
    public void saveFile(int id, MultipartFile file) throws IOException {
        Path uploadPath = Paths.get("uploads", "courses");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Course course= courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        course.setProfileImagePath(filename);
        courseRepository.save(course);

        System.out.println("Файл сохранён: " + filePath.toAbsolutePath());
    }

    @Override
    public ResponseEntity<Resource> getProfileImageId(int id) throws IOException {
        Course course= courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (course.getProfileImagePath() == null) {
            throw new FileNotFoundException("У курса нет изображения");
        }

        Path path = Paths.get("uploads/courses").resolve(course.getProfileImagePath());
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            throw new FileNotFoundException("Файл не найден: " + path.toString());
        }


        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(Files.probeContentType(path)))
                .body(resource);
    }

    public ByteArrayOutputStream generateCertificate(int courseId, Authentication authentication) {
        Student student = studentRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (!isCourseCompleted(student.getId(), course.getId())) {
            throw new RuntimeException("Course is not completed");
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Logger logger = LoggerFactory.getLogger(CourseServiceImpl.class);

        try {
            Document document = new Document(PageSize.A4.rotate(), 50, 50, 50, 50);
            PdfWriter writer = PdfWriter.getInstance(document, outputStream);
            document.open();

            // Background
            try {
                Image bg = Image.getInstance(getClass().getClassLoader().getResource("static/images/certificate_background.png"));
                bg.setAbsolutePosition(0, 0);
                bg.scaleToFit(PageSize.A4.getHeight(), PageSize.A4.getWidth());
                writer.getDirectContentUnder().addImage(bg);
            } catch (Exception e) {
                logger.warn("Background image not found.");
            }

            // Logo
            try {
                Image logo = Image.getInstance(getClass().getClassLoader().getResource("static/images/logo.png"));
                logo.scaleToFit(180, 180);
                logo.setAbsolutePosition(50, PageSize.A4.getWidth() - 200);
                document.add(logo);
            } catch (Exception e) {
                logger.warn("Logo image not found.");
            }

            // Fonts
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 36, Font.BOLD, new BaseColor(0, 51, 102));
            Font subtitleFont = new Font(Font.FontFamily.HELVETICA, 24, Font.BOLD);
            Font contentFont = new Font(Font.FontFamily.HELVETICA, 18);
            Font smallFont = new Font(Font.FontFamily.HELVETICA, 14, Font.ITALIC, BaseColor.GRAY);

            // Certificate ID
            String certId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            Paragraph idPara = new Paragraph("Certificate No: " + certId, smallFont);
            idPara.setAlignment(Element.ALIGN_RIGHT);
            document.add(idPara);

            // Title
            Paragraph title = new Paragraph("Certificate of Achievement", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingBefore(40);
            document.add(title);

            Paragraph subtitle = new Paragraph("Awarded for Course Completion", subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(30);
            document.add(subtitle);

            // Student Info
            Paragraph awardedTo = new Paragraph("Awarded to: " + student.getFirstname() + " " + student.getLastname(), contentFont);
            awardedTo.setAlignment(Element.ALIGN_CENTER);
            awardedTo.setSpacingAfter(15);
            document.add(awardedTo);

            Paragraph courseName = new Paragraph("Course: " + course.getTitle(), contentFont);
            courseName.setAlignment(Element.ALIGN_CENTER);
            courseName.setSpacingAfter(10);
            document.add(courseName);

            Paragraph completionDate = new Paragraph("Completion Date: " +
                    LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")), contentFont);
            completionDate.setAlignment(Element.ALIGN_CENTER);
            completionDate.setSpacingAfter(20);
            document.add(completionDate);

            double progress = calculateCourseProgress(student.getId(), course.getId());
            String formattedProgress = String.format("%.0f", progress); // Rounds to nearest integer
            Paragraph message = new Paragraph(
                    "This certificate confirms that the above-named individual has successfully completed the course with a score of "
                            + formattedProgress + "%.",
                    contentFont);
            message.setAlignment(Element.ALIGN_CENTER);
            message.setSpacingAfter(30);
            document.add(message);

            // Signature and "Issued by" on the same line using PdfPTable
            PdfPTable footerTable = new PdfPTable(2);
            footerTable.setWidthPercentage(80);
            footerTable.setWidths(new int[]{2, 3}); // Signature : Text ratio

            // Signature Cell
            PdfPCell signatureCell = new PdfPCell();
            signatureCell.setBorder(Rectangle.NO_BORDER);
            signatureCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            try {
                Image sign = Image.getInstance(getClass().getClassLoader().getResource("static/images/signature.png"));
                sign.scaleToFit(120, 40);
                signatureCell.addElement(sign);
            } catch (Exception e) {
                logger.warn("Signature image not found.");
            }
            footerTable.addCell(signatureCell);

            // Text Cell
            PdfPCell textCell = new PdfPCell(new Phrase("Issued electronically by Educational Platform Ozat", smallFont));
            textCell.setBorder(Rectangle.NO_BORDER);
            textCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            textCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            footerTable.addCell(textCell);

            document.add(footerTable);

            // Close
            document.close();
        } catch (Exception e) {
            logger.error("Certificate generation failed", e);
            throw new RuntimeException("Error generating certificate", e);
        }

        return outputStream;
    }


}
