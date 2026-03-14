/**
 * Internal API client — wraps the consumer-provided httpClient.
 */
import type {
  AiGatewayHttpClient,
  ApiResponse,
  AiStatusResponse,
  AiChatResponse,
  AiModelsResponse,
  AiConfigDto,
  AiConfigResponse,
} from "./types";
import type { AiChatRequest } from "@luetzen/ai-gateway";

export class AiGatewayApi {
  private http: AiGatewayHttpClient;
  private base: string;

  constructor(http: AiGatewayHttpClient, basePath: string = "/api/v1/ai") {
    this.http = http;
    this.base = basePath;
  }

  async getConfig(): Promise<AiConfigResponse> {
    const response = await this.http.get<ApiResponse<AiConfigResponse>>(
      `${this.base}/config`,
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || "Failed to fetch AI config");
  }

  async saveConfig(config: AiConfigDto): Promise<AiConfigResponse> {
    const response = await this.http.put<ApiResponse<AiConfigResponse>>(
      `${this.base}/config`,
      config,
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || "Failed to save AI config");
  }

  async getStatus(): Promise<AiStatusResponse> {
    const response = await this.http.get<ApiResponse<AiStatusResponse>>(
      `${this.base}/status`,
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || "Failed to fetch AI status");
  }

  async chat(request: AiChatRequest): Promise<AiChatResponse> {
    const response = await this.http.post<ApiResponse<AiChatResponse>>(
      `${this.base}/chat`,
      request,
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || "AI chat request failed");
  }

  async getModels(): Promise<AiModelsResponse> {
    const response = await this.http.get<ApiResponse<AiModelsResponse>>(
      `${this.base}/models`,
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || "Failed to fetch AI models");
  }

  async loadModel(model: string): Promise<void> {
    const response = await this.http.post<
      ApiResponse<{ model: string; message?: string }>
    >(`${this.base}/models/load`, { model });
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to load model");
    }
  }
}
