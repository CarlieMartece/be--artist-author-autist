const request = require("supertest");
const app = require("../app");
const db = require("../db");

const bookObj = expect.objectContaining({
  book_id: expect.any(Number),
  book_title: expect.any(String),
  edition_no: expect.any(Number),
  cover_stock_id: expect.any(String),
  art_id: expect.any(Number),
  release_date: expect.any(String),
  series_name: expect.any(String),
  sequence_no: expect.any(Number),
  sales_url: expect.any(String),
  blurb: expect.any(Object),
});

const artObj = expect.objectContaining({
  art_id: expect.any(Number),
  stock_id: expect.any(String),
  art_title: expect.any(String),
  three_word_description: expect.any(String),
  colours: expect.any(String),
  completion: expect.any(String),
  category_name: expect.any(String),
  series_name: expect.any(String),
  alt_text: expect.any(String),
  quote: expect.any(String),
  book_title: expect.any(String),
  made_from: expect.any(String),
  price: expect.any(String),
  self_ref: expect.any(String),
  close_ups: expect.any(String),
  link: expect.any(String),
});

afterAll(() => {
  if (db.end) db.end();
});

describe("handles all bad URLs", () => {
  test("GET:404 sends bad path response for all bad urls", () => {
    return request(app)
      .get("/api/wellness-guru")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("You must be lost.");
      });
  });
});

describe("/api/art", () => {
  test("GET: 200, Responds with an array of objects with art ids and stock_ids, most recent first", () => {
    return request(app)
      .get("/api/art")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.any(Array));
        expect(response.body).toHaveLength(16);
        expect(response.body[0]).toEqual({ art_id: 14, stock_id: '4122'});
      });
  });
  test("GET: 200, Responds with an array of objects for selected year", () => {
    return request(app)
      .get("/api/art?year=2005")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.any(Array));
        expect(response.body).toHaveLength(4);
        expect(response.body[0]).toEqual({ art_id: 4, stock_id: '3101a'});
      });
  });
  test("GET: 200, Responds with an array of objects for this year", () => {
    return request(app)
      .get("/api/art?year=now")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.any(Array));
        expect(response.body).toHaveLength(3);
        expect(response.body[0]).toEqual({ art_id: 14, stock_id: '4122'});
      });
  });
  test("GET: 200, Responds with an array of objects for selected category", () => {
    return request(app)
      .get("/api/art?category=3")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.any(Array));
        expect(response.body[0]).toEqual({"art_id": 4, "stock_id": "3101a"});
      });
  });
  test("GET: 200, Responds with an array of all visual art stock_ids (filtering out book, model, code) for category 16", () => {
    return request(app)
      .get("/api/art?category=16")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.any(Array));
        expect(response.body).toHaveLength(13);
        expect(response.body[0]).toEqual({ art_id: 14, stock_id: '4122'});
      });
  });
  test("GET: 200, Responds with an array of all visual art stock_ids filtered by year", () => {
    return request(app)
      .get("/api/art?category=16&year=2005")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.any(Array));
        expect(response.body).toHaveLength(3);
        expect(response.body[0]).toEqual({ art_id: 4, stock_id: '3101a'});
      });
  });
  test("GET: 200, Responds with an array of all traditional art stock_ids for category 13", () => {
    return request(app)
      .get("/api/art?category=13")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.any(Array));
        expect(response.body).toHaveLength(8);
        expect(response.body[0]).toEqual({"art_id": 13, "stock_id": "2001"});
      });
  });
  test("GET: 200, Responds with an array of all digital art stock_ids for category 46", () => {
    return request(app)
      .get("/api/art?category=46")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.any(Array));
        expect(response.body).toHaveLength(5);
        expect(response.body[0]).toEqual({ art_id: 14, stock_id: '4122'});
      });
  });
  test("GET: 200, Responds with an array of art stock_ids filtered by subject", () => {
    return request(app)
      .get("/api/art?subject=toys")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.any(Array));
        expect(response.body).toHaveLength(4);
      });
  });
  test("GET: 200, Responds with an array of art stock_ids filtered by colour", () => {
    return request(app)
      .get("/api/art?colour=purple")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.any(Array));
        expect(response.body[0]).toBe("4122");
        expect(response.body).toHaveLength(5);
      });
  });
  test("GET: 200, Responds with an array of art objects, each item for sale, price ascending", () => {
    return request(app)
      .get("/api/art?sort_by=price&order_by=asc")
      .expect(200)
      .then(({ body }) => {
        const art = body;
        expect(art).toEqual(expect.any(Array));
        expect(art).toHaveLength(3);
        expect(art[0]).toEqual(artObj);
        expect(art).toBeSortedBy("price", {
          ascending: true,
        });
      });
  });
  test("GET: 200, Responds with an array of art objects, each item for sale, price descending", () => {
    return request(app)
      .get("/api/art?sort_by=price")
      .expect(200)
      .then(({ body }) => {
        const art = body;
        expect(art).toEqual(expect.any(Array));
        expect(art).toHaveLength(3);
        expect(art[0]).toEqual(artObj);
        expect(art).toBeSortedBy("price", {
          descending: true,
        });
      });
  });
  test("GET: 400, Sends error response for invalid category input", () => {
    return request(app)
      .get("/api/art?category=kale-smoothie")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Non-valid search criteria");
      });
  });
  test("GET: 400, Sends error response for invalid subject input", () => {
    return request(app)
      .get("/api/art?subject=666")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Non-valid search criteria");
      });
  });
  test("GET: 400, Sends error response for invalid sort input", () => {
    return request(app)
      .get("/api/art?sort_by=sickle&order_by=desc")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Non-valid search criteria");
      });
  });
  test("GET: 400, Sends error response for invalid order input", () => {
    return request(app)
      .get("/api/art?sort_by=price&order_by=nary")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Non-valid search criteria");
      });
  });
  test("GET: 404, Sends error response for invalid colour input", () => {
    return request(app)
      .get("/api/art?colour=666")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Non-valid search criteria");
      });
  });
  test("GET: 404, Sends error response for valid but non-existent category", () => {
    return request(app)
      .get("/api/art?category=666")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Art not found");
      });
  });
  test("GET: 404, Sends error response for valid but non-existent subject", () => {
    return request(app)
      .get("/api/art?subject=yoga")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Art not found");
      });
  });
  test("GET: 404, Sends error response for valid but non-existent subject", () => {
    return request(app)
      .get("/api/art?colour=i-dont-see-colour")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Art not found");
      });
  });
});

describe("/api/art/:art_id", () => {
  test("GET: 200, Responds with requested art object", () => {
    return request(app)
      .get("/api/art/3")
      .expect(200)
      .then((response) => {
        expect(response.body.art).toEqual(artObj);
      });
  });
  test("GET: 400, Sends error message for invalid ID", () => {
    return request(app)
      .get("/api/art/emerge")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Are you lost?");
      });
  });
  test("GET: 404, Sends error message for valid but non-existent ID", () => {
    return request(app)
      .get("/api/art/3141")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Art not found");
      });
  });
});

describe("/api/books", () => {
  test("GET: 200, Responds with an array of book objects", () => {
    return request(app)
      .get("/api/books")
      .expect(200)
      .then(({ body }) => {
        const { books } = body;
        expect(books).toEqual(expect.any(Array));
        expect(books[0]).toEqual(bookObj);
        expect(books).toBeSortedBy("release_date", {
          descending: true,
        });
      });
  });
});

describe("/api/books/:book_id", () => {
  test("GET: 200, Responds with requested book object", () => {
    return request(app)
      .get("/api/books/3")
      .expect(200)
      .then((response) => {
        expect(response.body.book).toEqual(bookObj);
        expect(response.body.book.blurb).toHaveLength(4)
      });
  });
  test("GET: 400, Sends error message for invalid ID", () => {
    return request(app)
      .get("/api/books/emerge")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Are you lost?");
      });
  });
  test("GET: 404, Sends error message for valid but non-existent ID", () => {
    return request(app)
      .get("/api/books/314")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Book not found");
      });
  });
});

describe("/api/categories", () => {
  test("GET: 200, Responds with a category object", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toEqual({
          1: "Drawing",
          2: "Painting",
          3: "Collage",
          4: "Photography",
          5: "Digital",
          6: "Film",
          7: "Book",
          8: "Mixed",
          9: "Model",
          10: "Code",
        });
      });
  });
});

describe("./api/code", () => {
  test("GET: 200, Responds with an array of code objects", () => {
    return request(app)
      .get("/api/code")
      .expect(200)
      .then(({ body }) => {
        const { code } = body;
        expect(code).toEqual(expect.any(Array));
        expect(code[1]).toEqual({
          project_id: 2,
          stock_id: "10x002",
          name: "NC News",
          last_update: "2022-08-25T23:00:00.000Z",
          tech_stack: ["JavaScript", "Node", "React", "CSS3", "HTML5", "PostgreSQL"],
        });
      });
  });
});

describe("./api/code/:project_id", () => {
  test("GET: 200, Responds with requested project object", () => {
    return request(app)
      .get("/api/code/1")
      .expect(200)
      .then(({ body }) => {
        const { project } = body;
        expect(project).toEqual(
          expect.objectContaining({
            project_id: 1,
            stock_id: "10x001",
            name: "Carlie Martece",
            location: "https://carliemartece.com",
            view: "hybrid",
            first_launched: expect.any(String),
            last_update: expect.any(String),
            tech_stack: ["JavaScript", "Node", "React", "CSS3", "HTML5", "PostgreSQL"],
            description: "Artist, writer and coder portfolio",
            further_info: expect.any(String),
          })
        );
      });
  });
  test("GET: 400, Sends error message for invalid ID", () => {
    return request(app)
      .get("/api/code/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Are you lost?");
      });
  });
  test("GET: 404, Sends error message for valid but non-existent ID", () => {
    return request(app)
      .get("/api/code/3141")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Project not found");
      });
  });
});

describe("/api/series", () => {
  test("GET: 200, Responds with a series object", () => {
    return request(app)
      .get("/api/series")
      .expect(200)
      .then(({ body }) => {
        const { series } = body;
        expect(series).toEqual(
          expect.objectContaining({
            1: expect.any(String),
            2: expect.any(String),
            3: expect.any(String),
            4: expect.any(String),
            5: expect.any(String),
            6: expect.any(String),
          })
        );
      });
  });
});

describe("/api/series/:series_id", () => {
  test("GET: 200, Responds with requested series object plus array of linked artwork with close-ups removed", () => {
    return request(app)
      .get("/api/series/1")
      .expect(200)
      .then(({ body }) => {
        const { series } = body;
        expect(series).toEqual(
          expect.objectContaining({
            series_id: expect.any(Number),
            series_name: expect.any(String),
            category_name: expect.any(String),
            items: expect.any(Object),
          })
        );
        expect(series.items).toHaveLength(2);
        expect(series.items[0]).toEqual(artObj);
        expect(series.items).toBeSortedBy("stock_id", {
          ascending: true,
        });
      });
  });
  test("GET: 200, Responds with requested series object plus array of linked books with duplicate editions removed", () => {
    return request(app)
      .get("/api/series/4")
      .expect(200)
      .then(({ body }) => {
        const { series } = body;
        expect(series).toEqual(
          expect.objectContaining({
            series_id: expect.any(Number),
            series_name: expect.any(String),
            category_name: expect.any(String),
            items: expect.any(Object),
          })
        );
        expect(series.items[0]).toEqual(bookObj);
        expect(series.items).toHaveLength(3);
        expect(series.items).toBeSortedBy("sequence_no", {
          ascending: true,
        });
      });
  });
  test("GET: 400, Sends error message for invalid ID", () => {
    return request(app)
      .get("/api/series/emerge")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Are you lost?");
      });
  });
  test("GET: 404, Sends error message for valid but non-existent ID", () => {
    return request(app)
      .get("/api/series/314")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Series not found");
      });
  });
});

describe("/api/subjects", () => {
  test("GET: 200, Responds with a subjects object", () => {
    return request(app)
      .get("/api/subjects")
      .expect(200)
      .then(({ body }) => {
        const { subjects } = body;
        expect(subjects).toEqual([
          { subject: "toys", count: "4" },
          { subject: "fairies", count: "4" },
          { subject: "nails", count: "2" },
          { subject: "bpd", count: "2" },
          { subject: "dissociative identity", count: "2" },
          { subject: "Carlie Martece", count: "1" },
          { subject: "eyes", count: "1" }
        ]);
      });
  });
});
