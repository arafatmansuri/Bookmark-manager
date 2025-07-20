import axios from "axios";
import { describe, expect, it } from "vitest";
const BACKEND_URL = `http://localhost:3000`;
const USERNAME_1 = "harkirat7";
const USERNAME_2 = "raman";
const EMAIL_1 = "harkirat129@gmail.com";
const EMAIL_2 = "raman123@gmail.com";

const PASSWORD_1 = "Harkirat@123";
const PASSWORD_2 = "Raman@123";
describe("register user", () => {
  it("Double register doesn't work", async () => {
    const response1 = await axios.post(`${BACKEND_URL}/api/v1/user/register`, {
      username: USERNAME_1,
      email: EMAIL_1,
      password: PASSWORD_1,
    });
    expect(response1.status).toBe(200);
    try {
      const response2 = await axios.post(
        `${BACKEND_URL}/api/v1/user/register`,
        {
          username: USERNAME_1,
          email: EMAIL_1,
          password: PASSWORD_1,
        }
      );
      throw new Error("Expected request to fail but it succeeded");
    } catch (err: any) {
      expect(err.response.status).toBe(404);
      expect(err.response.data).toHaveProperty("message");
      expect(err.response.data.message).toContain(
        "Username/email already exists"
      );
    }
  });
});
