"use client";
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main className="route-state" role="alert"><h1>We couldn&apos;t load this page.</h1><p>Check your connection, then try the request again.</p><button className="button button-primary" onClick={reset}>Try again</button></main>}
