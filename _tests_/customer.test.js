const ControllerCustomer = require("../controllers/user");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const fs = require("fs");

const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JJZCI6NDE2LCJlbWFpbCI6InRoZWJsYWNrc3dvcmRzbWFuOTVAZ21haWwuY29tIiwidXNlcm5hbWUiOiJzdGV2ZW4gYW5kcmUiLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE2NDUyODEyODAsImV4cCI6MTY0NTI4NDg4MH0.0x65CjMY4I3gYknqRmzHKd4g0AHF-NNS4mYR6y5ectA";

let registerData = {
  email: "tested@test.com",
  password: "tested1",
  phoneNumber: "tested1",
  address: "tested1",
};
beforeAll(async () => {
  try {
    let data = JSON.parse(fs.readFileSync("./data/jobs.json", "utf-8"));
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    // console.log(data, `data`);
    await queryInterface.bulkInsert("Jobs", data);
  } catch (error) {
    console.log(error);
  }
});
afterAll(async () => {
  await queryInterface.bulkDelete("Jobs", null);
});

describe(`POST /user/register`, () => {
  afterEach(async () => {
    await User.destroy({
      where: {
        email: registerData.email,
      },
    });
  });

  describe(`POST /user/register - SUCCESS`, () => {
    it(`Should return status(201) with obj(email)`, async () => {
      const response = await request(app)
        .post("/user/register")
        .send(registerData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("email");
    });
  });

  describe(`POST /user/register - FAILURE`, () => {
    afterEach(() => {
      registerData = {
        email: "tested@test.com",
        password: "tested1",
        phoneNumber: "tested1",
        address: "tested1",
      };
    });

    describe(`Email tidak diberikan / tidak diinput`, () => {
      it(`Should return status(400) with error("Email cannot be empty")`, async () => {
        delete registerData.email;
        const response = await request(app)
          .post("/user/register")
          .send(registerData);
        expect(response.status).toBe(400);
        // console.log(response.body, `ERROr`);
        expect(response.body).toHaveProperty("Error");
        expect(response.body.Error[0]).toBe("Email cannot be empty");
      });
    });

    describe(`Password tidak diberikan / tidak diinput`, () => {
      it(`Should return status(400) with error("Password cannot be empty")`, async () => {
        delete registerData.password;
        const response = await request(app)
          .post("/user/register")
          .send(registerData);
        expect(response.status).toBe(400);
        // console.log(response.error.name, `ERROR`);
        expect(response.body).toHaveProperty("Error");
        expect(response.body.Error[0]).toBe("Password cannot be empty");
      });
    });

    describe(`Email diberikan string kosong`, () => {
      it(`Should return status(400) with error("Email cannot be empty")`, async () => {
        registerData.email = "";
        const response = await request(app)
          .post("/user/register")
          .send(registerData);
        expect(response.status).toBe(400);
        // console.log(response.error.name, `ERROR`);
        expect(response.body).toHaveProperty("Error");
        expect(response.body.Error[0]).toBe("Email cannot be empty");
      });
    });

    describe(`Password diberikan string kosong`, () => {
      it(`Should return status(400) with error("Password cannot be empty")`, async () => {
        registerData.password = "";
        const response = await request(app)
          .post("/user/register")
          .send(registerData);
        expect(response.status).toBe(400);
        // console.log(response.error.name, `ERROR`);
        expect(response.body).toHaveProperty("Error");
        expect(response.body.Error[0]).toBe("Password cannot be empty");
      });
    });

    describe(`Format Email salah / invalid`, () => {
      it(`Should return status(400) with error("Email must be email format")`, async () => {
        registerData.email = "tested";
        const response = await request(app)
          .post("/user/register")
          .send(registerData);
        expect(response.status).toBe(400);
        // console.log(response.error.name, `ERROR`);
        expect(response.body).toHaveProperty("Error");
        expect(response.body.Error[0]).toBe("Email must be email format");
      });
    });

    describe(`Email sudah terdaftar`, () => {
      it(`Should return status(400) with error("Email must be unique")`, async () => {
        await request(app).post("/user/register").send(registerData);

        const response = await request(app)
          .post("/user/register")
          .send(registerData);
        expect(response.status).toBe(400);
        // console.log(response.error.name, `ERROR`);
        expect(response.body).toHaveProperty("Error");
        expect(response.body.Error[0]).toBe("Email must be unique");
      });
    });
  });
});

describe(`POST /user/login`, () => {
  beforeAll(async () => {
    registerData.role = "user";
    await User.create(registerData);
  });
  afterAll(async () => {
    await User.destroy({
      where: {
        email: registerData.email,
      },
    });
  });
  describe(`POST /user/login - SUCCESS`, () => {
    it(`Should return status(200) with obj(access_token)`, async () => {
      const response = await request(app)
        .post("/user/login")
        .send({ email: registerData.email, password: registerData.password });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
    });
  });

  describe(`POST /user/login - FAILURE`, () => {
    it(`Wrong Email - status(401) with Error("Wrong email or password")`, async () => {
      const response = await request(app)
        .post("/user/login")
        .send({ email: "wrong@email.com", password: registerData.password });
      expect(response.status).toBe(401);
      // expect(response.body).toBeInstanceOf(Error);
      expect(response.body).toHaveProperty("Error");
      expect(response.body.Error).toBe("Wrong email or password");
    });

    it(`Wrong Password - status(401) with Error("Wrong email or password")`, async () => {
      const response = await request(app)
        .post("/user/login")
        .send({ email: registerData.email, password: "wrongPassword" });
      expect(response.status).toBe(401);
      // expect(response.body).toBeInstanceOf(Error);
      expect(response.body).toHaveProperty("Error");
      expect(response.body.Error).toBe("Wrong email or password");
    });
  });
});

describe(`GET /user/jobs`, () => {
  describe(`GET /user/jobs - SUCCESS`, () => {
    it(`GET ALL - status(200) with obj(jobs)`, async () => {
      const response = await request(app).get("/user/jobs")
      .send()
      .set()
      expect(response.status).toBe(200);
      //expect is array
      expect(response.body[0]).toHaveProperty("title", expect.any(String));
      expect(response.body[0]).toHaveProperty("description", expect.any(String));
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("jobType", expect.any(Number));
      expect(response.body[0]).toHaveProperty("companyId", expect.any(Number));
      expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
      expect(response.body[0]).toHaveProperty("status", expect.any(String));
    });

    it(`COMPANY FILTER - status(200) with obj(jobs)`, async () => {
      const response = await request(app)
        .get("/user/jobs?company=1")
        .send();
      expect(response.status).toBe(200);
      //expect is array
      expect(response.body[0]).toHaveProperty("title", expect.any(String));
      expect(response.body[0]).toHaveProperty("description", expect.any(String));
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("jobType", expect.any(Number));
      expect(response.body[0]).toHaveProperty("companyId", expect.any(Number));
      expect(response.body[0].companyId).toBe(1);
      expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
      expect(response.body[0]).toHaveProperty("status", expect.any(String));
    });
    it(`JOB TYPE FILTER - status(200) with obj(jobs)`, async () => {
      const response = await request(app)
        .get("/user/jobs?jobType=Part-Time")
        .send();
      expect(response.status).toBe(200);
      //expect is array
      expect(response.body[0]).toHaveProperty("title", expect.any(String));
      expect(response.body[0]).toHaveProperty("description", expect.any(String));
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("jobType", expect.any(Number));
      expect(response.body[0]).toHaveProperty("companyId", expect.any(Number));
      expect(response.body[0].jobType).toBe("Part-Time");
      expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
      expect(response.body[0]).toHaveProperty("status", expect.any(String));
    });
    it(`PAGE 2 - status(200) with obj(jobs)`, async () => {
      const response = await request(app)
        .get("/user/jobs?page=2")
        .send();
      expect(response.status).toBe(200);
      //expect is array
      expect(response.body[0]).toHaveProperty("title", expect.any(String));
      expect(response.body[0]).toHaveProperty("description", expect.any(String));
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("jobType", expect.any(Number));
      expect(response.body[0]).toHaveProperty("companyId", expect.any(Number));
      expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
      expect(response.body[0]).toHaveProperty("status", expect.any(String));
    });
  });
  describe(`GET /user/jobs/:jobId - SUCCESS`, () => {
    it(`Should return status(200) with obj(movie)`, async () => {
      const response = await request(app).get("/user/jobs/2").send();
      expect(response.status).toBe(200);
      // expect obj
      expect(response.body).toHaveProperty("title", expect.any(String));
      expect(response.body).toHaveProperty("description", expect.any(String));
      expect(response.body).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body).toHaveProperty("jobType", expect.any(Number));
      expect(response.body).toHaveProperty("companyId", expect.any(Number));
      expect(response.body).toHaveProperty("authorId", expect.any(Number));
      expect(response.body).toHaveProperty("status", expect.any(String));
    });
  });
  describe(`GET /user/jobs/:jobId - FAILURE`, () => {
    it(`Should return status(404) with Error("Error job not found")`, async () => {
      const response = await request(app).get("/user/jobs/1000").send();
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("Error");
      expect(response.body.Error).toBe("Error job not found");
    });
  });
});

describe(`GET/POST /user/bookmarks`, () => {
  describe(`GET /user/bookmarks - SUCCESS`, () => {
    it(`GET ALL - Should return status(200) with obj(bookmarks)`, async () => {
      const response = await request(app)
        .get("/user/bookmarks/2")
        .send()
        .set("access_token", access_token);
      expect(response.status).toBe(200);
      // expect obj
      expect(response.body[0]).toHaveProperty("UserId", expect.any(String));
      expect(response.body[0]).toHaveProperty("JobId", expect.any(String));
      expect(response.body[0]).toHaveProperty("Job", expect.any(String));
      expect(response.body[0].Job).toHaveProperty("description", expect.any(String));
      expect(response.body[0].Job).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0].Job).toHaveProperty("jobType", expect.any(Number));
      expect(response.body[0].Job).toHaveProperty("companyId", expect.any(Number));
      expect(response.body[0].Job).toHaveProperty("authorId", expect.any(Number));
      expect(response.body[0].Job).toHaveProperty("status", expect.any(String));
    });
  });

  describe(`POST /user/bookmarks - SUCCESS`, () => {
    it(`POST - Should return status(201) with obj(bookmarks)`, async () => {
      const response = await request(app)
        .post("/user/bookmarks")
        .send()
        .set("access_token", access_token);
      expect(response.status).toBe(201);
      // expect obj
      expect(response.body[0]).toHaveProperty("UserId", expect.any(String));
      expect(response.body[0]).toHaveProperty("JobId", expect.any(String));
    });
  });
});
