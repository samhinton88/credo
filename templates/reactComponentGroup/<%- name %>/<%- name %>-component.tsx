

<% if (props && props.length > 0) {%>
export interface <%- capitalize(dashToCamel(name)) %>Props {
<% props.forEach(p => {%>
    <%- p %>
<% }) %>
}
<%}%>

export const <%- capitalize(dashToCamel(name)) %> = (
    <% if (props && props.length > 0 ) { %>
        props: <%- capitalize(dashToCamel(name)) %>Props
    <% } %>
) => <div />