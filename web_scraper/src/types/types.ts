export interface ScrapingTask {
    placeId: string,
    placeName: string;
    maxScrolls: number;
    placeAddress:string,
    iteration:number 
    requestId?: string; // Optional requestId for load balancer 
}