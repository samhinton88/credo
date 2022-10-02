/*
<%
const capName = capitalize(name);
%>
*/

import { Module } from '@nestjs/common';
import {
  Context,
  Field,
  ID,
  ObjectType,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { Prisma } from './prisma';
import { keyBy } from 'lodash';
import { Integration } from './integrations/resolver';
import { Resource } from './resource';

export type <%- capName %>sLoader = <%- capName %>Loader<string, Design>;

export const designsLoader = 'designsLoader';

export function create<%- capName %>sLoader(prisma: Prisma) {
  return new DataLoader<string, Omit<<%- capName %>, 'resource'>>(async (ids) => {
    const data = await prisma.resource.findMany({
      include: {
        <%- name %>: true,
        integration: {
          select: {
            id: true,
            app: true,
          },
        },
      },
      where: {
        id: {
          in: ids as string[],
        },
      },
    });

    const dataMap = keyBy(data, 'id');

    return ids.map((id) => {
      const value = dataMap[id];
      return {
        id: value.id,
        integration: value.integration,
        resource: {
          id: value.id,
        },
        title: value.<%- name %>!.name,
        url: `https://www.figma.com/file/${value.figmaFile!.key}`,
      };
    });
  });
}

@ObjectType()
export class Design {
  @Field(() => ID)
  id!: string;
  
  <% for (const field of fields) {%>
    <% 
    const [fieldName, fieldType] = field.split(':');
    %>
    @Field(<%- fieldType[0] === fieldType[0].toUpperCase() ? "() => " + fieldType : "" %>) 
    <%- fieldName %>!: <%- fieldType %>;
  <% } %>
}

@Resolver(() => <%- capName %>)
export class <%- capName %>Resolver {
  @ResolveField()
  async integration(
    @Parent() { id },
    @Context(<%- capName %>sLoader) loader: <%- capName %>sLoader,
  ) {
    const { integration } = await loader.load(id);
    return integration;
  }

  <% for (const field of fields) {%>
    <% 
    const [fieldName, fieldType] = field.split(':');
    %>
    @ResolveField()
    async title(@Parent() { id }, @Context(<%- name %>sLoader) loader: <%- capName %>sLoader) {
      const { <%- fieldName %> } = await loader.load(id);
      return <%- fieldName %>;
    }
  <% } %>


  @ResolveField()
  resource(@Parent() { id }) {
    return { id };
  }
}

@Module({
  providers: [<%- capName %>Resolver],
})
export class <%- capName %>sModule {}