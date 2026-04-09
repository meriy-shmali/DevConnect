import { notifyManager } from "@tanstack/react-query";
import { use } from "react";

export const staticposts = [
  {
    id: 1,
    user: {
      id: 1,
      username: "Samer_hili",
      personal_photo_url: "/images/photo2.jpg",
      is_following: true
    },
    trending:"best_following",
    post_type: "question",
    created_at: "2026-04-06T10:00:00Z",
    content: "How can I optimize React performance?",
    media: [],
    code: "",
    code_language: "",
    tags: ["#React #javascript"],
    reaction_counts: {
      useful: 320,
      not_useful: 0,
      creative_solution: 20,
      same_problem: 0
    },
    user_reaction: null,
    total_comments: 67
  },
  {
    id: 2,
    user: {
      id: 2,
      username: "Sara98",
      personal_photo_url: "/images/photo1.jpg",
      is_following: false
    },
    trending:"based on your intersted",
    post_type: "project",
    created_at: "2026-04-05T08:00:00Z",
    content: "Here is some of UI/UX",
    media: ["/images/ui1.png","/images/ui2.png"],
    code: "",
    code_language: "",
    tags: ["#ui/ux #webDesign #landpage"],
    reaction_counts: {
      useful: 100,
      not_useful: 7,
      creative_solution: 30,
      same_problem: 0
    },
    user_reaction: null,
    total_comments: 90
  },
  {
    id: 3,
    user: {
      id: 3,
      username: "Tarek peter",
      personal_photo_url: "/images/photo3.jpg",
      is_following: false
    },trending:"trending",
    post_type: "problem",
    created_at: "2026-04-06T07:00:00Z",
    content: "My code gives error",
    media: [],
    code: `const fetchData = async () => {
 const res = await axios.get("/api");
 console.log(res.data)
 <p>hello</p>
 <div>welcome to our project</div>
 <div>welcome to our project</div>
 <div>welcome to our project</div>
 <div>welcome to our project</div>;
}`,
    code_language: "javascript",
    tags: ["#Error #help #React"],
    reaction_counts: {
      useful: 10,
      not_useful: 0,
      creative_solution: 30,
      same_problem: 9
    },
    user_reaction: null,
    total_comments: 20
  }
];