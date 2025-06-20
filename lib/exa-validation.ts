import Exa from "exa-js";
import { Company, EmployeeSize } from "../models/company";

const exa = new Exa(process.env.EXA_API_KEY || "");

// Rate limiter to respect Exa's 5 requests per second limit
class RateLimiter {
  private requestTimes: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 5, timeWindowMs: number = 1000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  async waitForNextRequest(): Promise<void> {
    const now = Date.now();

    // Remove requests older than the time window
    this.requestTimes = this.requestTimes.filter(
      (time) => now - time < this.timeWindow
    );

    // If we're at the limit, wait until the oldest request is outside the window
    if (this.requestTimes.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requestTimes);
      const waitTime = this.timeWindow - (now - oldestRequest) + 10; // Add 10ms buffer

      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    // Record this request
    this.requestTimes.push(Date.now());
  }
}

const rateLimiter = new RateLimiter(5, 1000); // 5 requests per second

async function validateSingleCompany(
  company: Omit<Company, "id"> & { temp_id: number }
): Promise<Omit<Company, "id"> & { temp_id: number }> {
  try {
    // Wait for rate limit before making request
    await rateLimiter.waitForNextRequest();

    // Search for company information using Exa
    const searchQuery = `${company.company_name} employee size`;

    const searchResults = await exa.searchAndContents(searchQuery, {
      type: "auto",
      numResults: 1,
      category: "company",
      // // We do this to prevent Exa failing on invalid domains
      // ...(isValidDomain(company.domain)
      //   ? { includeDomains: [company.domain] }
      //   : {}),
      text: true,
      highlights: true,
      summary: true,
    });

    // Create descriptive string for OpenAI to process
    const originalSize = company.employee_size;
    const searchSummary =
      searchResults?.results?.[0]?.summary || "No additional information found";
    const descriptiveEmployeeSize = `The data uploaded said they had ${originalSize} employees. Our search for employees returned ${searchSummary}`;

    return {
      ...company,
      employee_size: descriptiveEmployeeSize as EmployeeSize,
    };
  } catch (error) {
    console.error(
      `Error validating employee counts with Exa for ${company.company_name} (${company.domain}):`,
      error
    );
    // Return original company data if search fails
    return company;
  }
}

export async function validateEmployeeCounts(
  companies: (Omit<Company, "id"> & { temp_id: number })[]
): Promise<(Omit<Company, "id"> & { temp_id: number })[]> {
  console.log("Validating employee counts");
  const validatedCompanies: (Omit<Company, "id"> & { temp_id: number })[] = [];

  // Process companies sequentially to respect rate limits
  // Using a for loop instead of batched Promise.all to ensure proper rate limiting
  for (const company of companies) {
    try {
      const validatedCompany = await validateSingleCompany(company);
      validatedCompanies.push(validatedCompany);
    } catch (error) {
      console.error(`Error processing company ${company.company_name}:`, error);
      // If individual company fails, add original company to maintain data integrity
      validatedCompanies.push(company);
    }
  }

  return validatedCompanies;
}
