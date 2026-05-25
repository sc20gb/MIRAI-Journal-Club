/**
 * Data schema for publication entries.
 *
 * @typedef {Object} PublicationLink
 * @property {string} label
 * @property {string} url
 *
 * @typedef {Object} Publication
 * @property {number} year
 * @property {"Journal" | "Conference" | "Preprint" | "Workshop" | string} type
 * @property {string} title
 * @property {string} authors
 * @property {string} [venue]
 * @property {string} [image]
 * @property {string} [venueLogo]
 * @property {string} [url]
 * @property {PublicationLink[]} [links]
 * @property {string} [award]
 * @property {string[]} [tags]
 */

window.MIRAI_PUBLICATIONS = [
    {
        year: 2026,
        type: "Journal",
        title: "Paper 1",
        authors: "Author 1, Author 2",
        venue: "Journal 1",
        image: "./images/MIRAI_logo.png",
        links: [
            {
                label: "Paper",
                url: "https://example.com/paper-1",
            },
            {
                label: "Code",
                url: "https://github.com/example/code-1",
            },
        ],
        tags: ["Tag 1", "Tag 2"],
    },
    {
        year: 2026,
        type: "Conference",
        title: "Paper 2",
        authors: "Author 1, Author 3",
        venue: "Conference 1",
        links: [
            {
                label: "Paper",
                url: "https://example.com/paper-2",
            },
            {
                label: "Code",
                url: "",
            },
        ],
        award: "Award 1",
        tags: ["Tag 3"],
    },
    {
        year: 2025,
        type: "Journal",
        title: "Paper 3",
        authors: "Author 2, Author 4",
        venue: "Journal 2",
        links: [
            {
                label: "Paper",
                url: "https://example.com/paper-3",
            },
            {
                label: "Code",
                url: "https://github.com/example/code-3",
            },
        ],
        tags: ["Tag 1"],
    },
    {
        year: 2025,
        type: "Conference",
        title: "Paper 4",
        authors: "Author 3, Author 5",
        venue: "Conference 2",
        image: "./images/MIRAI_logo.png",
        links: [
            {
                label: "Paper",
                url: "https://example.com/paper-4",
            },
            {
                label: "Code",
                url: "https://github.com/example/code-4",
            },
        ],
        tags: ["Tag 2", "Tag 4"],
    },
    {
        year: 2025,
        type: "Workshop",
        title: "Paper 5",
        authors: "Author 1, Author 5",
        venue: "Workshop 1",
        links: [
            {
                label: "Paper",
                url: "https://example.com/paper-5",
            },
            {
                label: "Code",
                url: "",
            },
        ],
        tags: ["Tag 5"],
    },
    {
        year: 2024,
        type: "Preprint",
        title: "Paper 6",
        authors: "Author 6, Author 7",
        venue: "Preprint 1",
        links: [
            {
                label: "Paper",
                url: "https://example.com/paper-6",
            },
            {
                label: "Code",
                url: "https://github.com/example/code-6",
            },
        ],
        tags: ["Tag 6"],
    },
    {
        year: 2023,
        type: "Workshop",
        title: "Paper 7",
        authors: "Author 8, Author 9",
        venue: "Workshop 2",
        links: [
            {
                label: "Paper",
                url: "https://example.com/paper-7",
            },
            {
                label: "Code",
                url: "",
            },
        ],
        award: "Award 2",
        tags: ["Tag 7"],
    },
    {
        year: 2022,
        type: "Conference",
        title: "Paper 8",
        authors: "Author 10, Author 11",
        venue: "Conference 3",
        links: [
            {
                label: "Paper",
                url: "https://example.com/paper-8",
            },
            {
                label: "Code",
                url: "https://github.com/example/code-8",
            },
        ],
        tags: ["Tag 8"],
    },
    {
        year: 2021,
        type: "Journal",
        title: "Paper 9",
        authors: "Author 12, Author 13",
        venue: "Journal 3",
        links: [
            {
                label: "Paper",
                url: "https://example.com/paper-9",
            },
            {
                label: "Code",
                url: "https://github.com/example/code-9",
            },
        ],
        tags: ["Tag 9"],
    },
];
