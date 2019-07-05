import React from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { Mutation, ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "https://jojo-graph-server-qsbihtijfc.now.sh/"
});

const Characters = () => (
  <Query
    query={gql`
      {
        characters {
          name
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.characters.map(({ name }) => (
        <p key={name}>{name}</p>
      ));
    }}
  </Query>
)

const Files = () => (
  <Query
    query={gql`
      {
        uploads {
          id
          url
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.uploads.map(({ id, url }) => (
        <div key={id}>
          <figure>
            <img src={url} width="120" heigh="120" />
            <figcaption>{id}: {url}</figcaption>
          </figure>
        </div>
      ));
    }}
  </Query>
);

const mutateUpload = gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      id
      url
    }
  }
`

const Uploader = () => {
  return (
    <Mutation mutation={mutateUpload} >
      {mutate => (
        <input
          type="file"
          required
          onChange={({
            target: {
              validity,
              files: [file]
            }
          }) => validity.valid && mutate({ variables: { file } })}
        />
      )}
    </Mutation>
  )
}

const App = () => (
  <ApolloProvider client={client}>
    <div style={{ padding: "3em" }}>
      <h2>My first Apollo app 🚀</h2>
      <Uploader />
      <Files />
      <h2>Characters</h2>
      <Characters />
    </div>
  </ApolloProvider>
);

render(<App />, document.getElementById("root"));
