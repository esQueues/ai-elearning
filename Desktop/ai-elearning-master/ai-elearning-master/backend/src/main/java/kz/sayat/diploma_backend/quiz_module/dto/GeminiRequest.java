package kz.sayat.diploma_backend.quiz_module.dto;

import java.util.List;
import java.util.Map;

public class GeminiRequest {
    private List<Map<String, List<Map<String, String>>>> contents;

    public GeminiRequest(String text) {
        this.contents = List.of(
            Map.of("parts", List.of(Map.of("text", text)))
        );
    }

    public List<Map<String, List<Map<String, String>>>> getContents() {
        return contents;
    }
}
