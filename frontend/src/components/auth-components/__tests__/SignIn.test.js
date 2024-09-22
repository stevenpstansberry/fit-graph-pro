import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { loginUser } from "../../../services/FitGraphAPIServices";
import AuthService from "../../../services/AuthService"; // Import AuthService to test session
import { cleanup } from "@testing-library/react";

// Create a mock instance for Axios
const mock = new MockAdapter(axios);

describe("Login API Tests", () => {
  afterEach(() => {
    // Clear sessionStorage and mocks after each test to avoid test pollution
    sessionStorage.clear();
    mock.reset();
    cleanup();
  });

  it("should log in a user and store the token in sessionStorage", async () => {
    // Define the mock response from the API
    const mockResponse = {
      user: { username: process.env.REACT_APP_TEST_USERNAME },
      token: "mocked-jwt-token",
    };

    // Mock the POST request to the /login endpoint
    mock.onPost(/\/login/).reply(200, mockResponse);

    // Use credentials from the environment variables
    const credentials = {
      username: process.env.REACT_APP_TEST_USERNAME,
      password: process.env.REACT_APP_TEST_PASSWORD,
    };

    // Call the loginUser function (which should store the user and token in sessionStorage)
    const result = await loginUser(credentials);

    // Verify the response matches the mock
    expect(result.user.username).toEqual(process.env.REACT_APP_TEST_USERNAME);

    // Check if the token and user are correctly stored in sessionStorage
    expect(sessionStorage.getItem("token")).toBe("mocked-jwt-token");
    expect(sessionStorage.getItem("user")).toBe(
      JSON.stringify(mockResponse.user)
    );

    // Test if AuthService.getUser() correctly returns the user from sessionStorage
    const storedUser = AuthService.getUser();
    expect(storedUser).toEqual(mockResponse.user);
  });

  it("should handle login failure", async () => {
    // Simulate a failed login with a 401 status code
    mock.onPost("/login").reply(401, { message: "Invalid credentials" });

    const credentials = {
      username: process.env.REACT_APP_TEST_USERNAME,
      password: "wrongpassword",
    };

    try {
      await loginUser(credentials);
    } catch (error) {
      // Assert that an error response contains the expected message
      expect(error.response.data.message).toEqual("Invalid credentials");
    }
  });
});
