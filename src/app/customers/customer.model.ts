export interface CountryData {
    country: string;
    region: string;
  }
  
export interface ApiResponse {
    data: {
      [code: string]: CountryData;
    };
  }
  