/**
 * Data schema for member profiles.
 *
 * @typedef {Object} MemberLinks
 * @property {string} googleScholar
 * @property {string} linkedIn
 * @property {string} github
 * @property {string} personalWebsite
 *
 * @typedef {Object} Member
 * @property {string} id
 * @property {string} name
 * @property {"staff" | "phd" | "masters"} category
 * @property {string} [position]
 * @property {string} [since]
 * @property {string} image
 * @property {string} email
 * @property {MemberLinks} links
 * @property {string} overview
 * @property {string[]} researchInterests
 */

const emptyLinks = {
    googleScholar: "",
    linkedIn: "",
    github: "",
    personalWebsite: "",
};

function createStaffPlaceholder(id, name, details = {}) {
    return {
        id,
        name,
        category: "staff",
        position: details.position || "Staff position",
        // Add future real image paths here, for example: "./images/members/member-name.jpg".
        image: details.image || "",
        email: details.email || "",
        links: { ...emptyLinks, ...(details.links || {}) },
        overview: details.overview || "",
        researchInterests: details.researchInterests || [],
    };
}

function createStudentPlaceholder(id, name, category, details = {}) {
    return {
        id,
        name,
        category,
        since: details.since || "",
        // Add future real image paths here, for example: "./images/members/member-name.jpg".
        image: details.image || "",
        email: details.email || "",
        links: { ...emptyLinks, ...(details.links || {}) },
        overview: details.overview || "",
        researchInterests: details.researchInterests || [],
    };
}

window.MIRAI_MEMBER_SECTIONS = {
    staff: [
        createStaffPlaceholder(
            "staff-1",
            "Dr. Duygu Sarikaya",
            {
                position: "Assistant Professor",
                image: "./images/members/Duygu_Sarikaya.png",
                email: "D.Sarikaya@leeds.ac.uk",
                links: {
                    googleScholar: "https://scholar.google.com/citations?user=66F5AnAAAAAJ&hl=en",
                    personalWebsite: "https://eps.leeds.ac.uk/computing/staff/13320/dr-duygu-sarikaya",
                },
                overview: "My research interests span defining the technologies of future, artificial intelligence powered, healthcare applications. More specifically, I work on computer vision, vision-language models, generative learning for healthcare applications.",
                researchInterests: [
                    "computer vision",
                    "vision-language models",
                    "generative learning",
                    "deep learning",
                    "machine learning",
                    "medical robotics",
                    "surgical vision and perception",
                    "computer assisted surgery",
                    "medical image computing",
                ],
            }
        ),
    ],
    phd: [
        createStudentPlaceholder(
            "phd-1",
            "Arpita Saggar",
            "phd",
            {
                since: "2023.10",
                image: "./images/members/Arpita_Saggar.jpg",
                email: "scasag@leeds.ac.uk",
                links: {
                    googleScholar: "https://scholar.google.co.uk/citations?hl=en&pli=1&user=YAAJNhwAAAAJ",
                    personalWebsite: "https://arpita2512.github.io/",
                },
                overview: "I am currently a PhD student at the UKRI Centre for Doctoral Training in AI for Medical Diagnosis and Care. Before joining the CDT, I was part of the Data Science for Social Good fellowship at the University of Warwick, where I worked with Save The Children and UNICEF to map multidimensional child poverty across sub-Saharan Africa. My background is in Computing, and I've previously worked on research projects at the intersection of AI and healthcare.",
                researchInterests: [
                    "My research focuses on the simulation of virtual patients to support medical training.",
                ],
            }
        ),
        createStudentPlaceholder(
            "phd-2",
            "Lucy Fothergill",
            "phd",
            {
                since: "2023.10",
                image: "./images/members/Lucy_Fothergill.jpg",
                email: "sclef@leeds.ac.uk",
                links: {
                    googleScholar: "https://scholar.google.com/citations?hl=en&user=YzTd-vcAAAAJ",
                    personalWebsite: "https://ai-medical.leeds.ac.uk/profiles/lucy-fothergill/",
                },
                overview: "I graduated from Lancaster University in 2022 after completing an integrated masters degree in Mathematics and Statistics. In my dissertation project I investigated the use of the Exp3 algorithm and adversarial bandits as a way of solving the multi armed bandit problem.",
                researchInterests: [
                    "Vision-Based 6DoF Surgical Tool Pose Estimation",
                    "Medical Vision-Language Models",
                    "Safety-Critical Surgical Automation",
                ],
            }
        ),
        createStudentPlaceholder(
            "phd-3",
            "Xin Ci Wong",
            "phd",
            {
                since: "2023.10",
                image: "./images/members/Xin_Ci_Wong.png",
                email: "scxcw@leeds.ac.uk",
                links: {
                    googleScholar: "https://scholar.google.com/citations?hl=en&user=CBaLDjAAAAAJ",
                    personalWebsite: "https://ai-medical.leeds.ac.uk/profiles/xin-ci-wong/",
                },
                overview: "I was awarded an MBBS degree in 2011 from Manipal University under fully-funded Malaysian Government Scholarship. In 2019, I graduated from the University of Malaya, receiving a Master of Data Science degree with distinction. Before joining this CDT, I served in the Ministry of Health Malaysia for around ten years, working in both tertiary and rural hospitals, with clinical experiences focusing on emergency medicine. My research career started at Institute for Clinical Research, mainly dealing with medical data, digital health and emerging technologies such as 3D printing.",
                researchInterests: [
                    "Addressing Domain Shift in Medical AI",
                    "Generative Adaptation via Diffusion Models",
                    "Robustness and Generalization",
                ],
            }
        ),
        createStudentPlaceholder(
            "phd-4",
            "George Baker",
            "phd",
            {
                since: "2023.10",
                image: "./images/members/George_Baker.jpeg",
                email: "sc20gwb@leeds.ac.uk",
                links: {
                    googleScholar: "",
                    personalWebsite: "https://ai-medical.leeds.ac.uk/profiles/george-baker/",
                },
                overview: "I hold a BSc in Computer Science from the University of Leeds, where my final project was centred on tumour segmentation in MRI scans using Convolutional Neural Networks (CNNs). Now enrolled in the CDT program, I am eager to contribute further to the intersection of Artificial Intelligence and healthcare.",
                researchInterests: [
                    "My project aims to address domain shift in medical imaging data by leveraging generative models, particularly diffusion models, to adapt medical imaging datasets across different domains.",
                ],
            }
        ),
        createStudentPlaceholder(
            "phd-5",
            "Yushi Guo",
            "phd",
            {
                since: "2024.02",
                image: "./images/members/Yushi_Guo.jpg",
                email: "scyg@leeds.ac.uk",
                links: {
                    googleScholar: "",
                    personalWebsite: "https://eps.leeds.ac.uk/computing/pgr/14494/yushi-guo",
                },
                overview: "I graduated from the University of Southampton, receiving a Master of Computer Science degree with distinction.",
                researchInterests: [
                    "My project aims to address domain shift in medical imaging data by leveraging generative models, particularly diffusion models, to adapt medical imaging datasets across different domains.",
                ],
            }
        ),
        createStudentPlaceholder(
            "phd-6",
            "Jing Li",
            "phd",
            {
                since: "2025.04",
                image: "./images/members/Jing_Li.jpg",
                email: "sc232jl@leeds.ac.uk",
                links: {
                    googleScholar: "",
                    personalWebsite: "https://ai-medical.leeds.ac.uk/profiles/jing-li-associate/",
                },
                overview: "I graduated from the University of Leeds, receiving a Master of Computer Science degree with distinction.",
                researchInterests: [
                    "computer vision",
                    "vision-language models",
                    "medical image computing",
                ],
            }
        ),
    ],
    masters: [],
};
