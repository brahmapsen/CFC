//import Head from "next/head"; // HTML Head
import Header from "./Header" // Header component
import React from "react"

export default function Layout({ children }, isProfile) {
  return (
    <React.Fragment>
      <Header /> <div className="container pt-5 pb-2">{children}</div>
    </React.Fragment>
  )
}

//{typeof window === "undefined" ? null : {children} />}
