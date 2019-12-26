import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import React, { useState, useEffect} from "react";
import { ApolloProvider} from "react-apollo";
import { AuthState } from "./types";
import Home from "./Home";

export default function App({ authState }: { authState: AuthState }) {
  
  const isIn = authState.status === "in";
  const [token, setToken] = useState(authState.token)

  useEffect(() => {
    if (authState.token) {
      setToken(authState.token)
    }
  }, [authState])


  let headers = (isIn ? { Authorization: `Bearer ${token}` } : {})  
 
  let wsLink = new WebSocketLink({
    uri: "ws://46.101.160.99/v1/graphql",
    options: {
      reconnect: true,
      connectionParams: {
        headers
      }
    }
  })
  
  let httpLink = new HttpLink({
    uri: "http://46.101.160.99/v1/graphql",
    headers
  })

  let link = split(
    ({ query }) => {
      let definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
  )
  

  let client = new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
  
  
  return (
    <div>
      {/* <Auth/> */}
      
      {client &&
        <ApolloProvider client={client}>
        <Home/>
        </ApolloProvider>
      }
      
      
    </div>

  );


}