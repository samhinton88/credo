import { render, fireEvent, waitFor, screen } from '@testing-library/react'
<% if (fetchedResourcePath) { %>import { setupServer, rest } from 'msw'<%}%>
import { <%- capitalize(dashToCamel(name)) %> } from "./<%- name %>-component"

const getMock = jest.fn();

<% if (fetchedResourcePath) { %>
const server = setupServer(
  rest.get('/<%- fetchedResourcePath %>', (req, res, ctx) =>  {
    getMock()
    return res(ctx.json({ }))
  }),
)

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

<%}%>

describe("<<%- capitalize(dashToCamel(name)) %> />", () => {
    <% if (fetchedResourcePath) { %>
        it("should fetch <%- fetchedResourcePath %>", async () => {
          render(<<%-  capitalize(dashToCamel(name)) %> />);
          
          await waitFor(() => expect(getMock).toHaveBeenCalled())
        });
        
        it("handles server error", async ()=> {
          server.use(
            rest.get('/<%- fetchedResourcePath %>', (req, res, ctx) => {
              return res(ctx.status(500))
            }),
          );
          
        })
      <%}%>
<% if (tests) { %>
<% tests.forEach(t => { %>
    it("<%- t %>", () => {

    });<% }) %>

<% } %>
})