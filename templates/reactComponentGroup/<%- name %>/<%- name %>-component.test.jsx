
describe("<<%- capitalize(dashToCamel(name))>")
<% if (tests) { %>
<% tests.forEach(t => { %>
    it("should <%- t %>", () => {
        
    })
<% }) %>
<% } %>