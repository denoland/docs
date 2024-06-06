import React from "react";
import Layout from "@theme/Layout";
import Footer from "@theme/Footer";

const APIReference = () => {
  const apiLinks = [
    { id: "1", title: "API 1", url: "/api/1" },
    { id: "2", title: "API 2", url: "/api/2" },
    { id: "2", title: "API 2", url: "/api/2" },
    { id: "3", title: "API 3", url: "/api/3" },
    { id: "4", title: "API 4", url: "/api/4" },
    { id: "5", title: "API 5", url: "/api/5" },
    { id: "6", title: "API 6", url: "/api/6" },
    { id: "7", title: "API 7", url: "/api/7" },
    { id: "8", title: "API 8", url: "/api/8" },
    { id: "9", title: "API 9", url: "/api/9" },
    { id: "10", title: "API 10", url: "/api/10" },
    { id: "11", title: "API 11", url: "/api/11" },
    { id: "12", title: "API 12", url: "/api/12" },
    { id: "13", title: "API 13", url: "/api/13" },
    { id: "14", title: "API 14", url: "/api/14" },
    { id: "15", title: "API 15", url: "/api/15" },
    { id: "16", title: "API 16", url: "/api/16" },
    { id: "17", title: "API 17", url: "/api/17" },
    { id: "18", title: "API 18", url: "/api/18" },
    { id: "19", title: "API 19", url: "/api/19" },
    { id: "20", title: "API 20", url: "/api/20" },
    { id: "21", title: "API 21", url: "/api/21" },
    { id: "22", title: "API 22", url: "/api/22" },
    { id: "23", title: "API 23", url: "/api/23" },
    { id: "24", title: "API 24", url: "/api/24" },
    { id: "25", title: "API 25", url: "/api/25" },
    { id: "26", title: "API 26", url: "/api/26" },
    { id: "27", title: "API 27", url: "/api/27" },
    { id: "28", title: "API 28", url: "/api/28" },
    { id: "29", title: "API 29", url: "/api/29" },
    { id: "30", title: "API 30", url: "/api/30" },
    { id: "31", title: "API 31", url: "/api/31" },
    { id: "32", title: "API 32", url: "/api/32" },
    { id: "33", title: "API 33", url: "/api/33" },
    { id: "34", title: "API 34", url: "/api/34" },
    { id: "35", title: "API 35", url: "/api/35" },
    { id: "36", title: "API 36", url: "/api/36" },
    { id: "37", title: "API 37", url: "/api/37" },
    // Add more links as needed
  ];

  return (
    <Layout
      title={"Deno: the easiest, most secure JavaScript runtime"}
      description="Reference documentation for the Deno runtime and Deno Deploy"
    >
      <div className="w-full mt-8 h-screen max-w-screen-xl mx-auto">
        <div className="mt-24">
          <h1>API Reference</h1>
          <ul>
            {apiLinks.map((link) => {
              return (
                <li key={link.id}>
                  <a
                    href={link.url}
                    className="text-inherit underline decoration-gray-300 dark:decoration-gray-600"
                  >
                    {link.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <Footer />
    </Layout>
  );
};

export default APIReference;
