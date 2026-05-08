const palette = {
    teal: "#00a6a6",
    green: "#4c9f38",
    coral: "#f25f4c",
    gold: "#f6ae2d",
    blue: "#3366cc",
    ink: "#101418",
    muted: "#5d6875"
};

const projects = [
    {
        name: "travelMate",
        category: "sde",
        size: 96,
        color: palette.teal,
        stack: ["Next.js", "FastAPI", "Gemini", "Google Places", "Routes"],
        proof: "Built an AI-assisted travel planning platform with a chat-first frontend, structured itinerary generation, route-aware logic, and planner orchestration across Next.js and FastAPI."
    },
    {
        name: "AI Fashion Stylist App",
        category: "mlai",
        size: 84,
        color: palette.coral,
        stack: ["Node.js", "Express", "Gemini", "Ollama", "MongoDB"],
        proof: "Built an AI-powered fashion stylist MVP with image upload, wardrobe-aware recommendations, and a unified service layer combining Google Gemini and local Ollama models."
    },
    {
        name: "Accio: PDF/OCR Processing for Workflow Digitization",
        category: "mlai",
        size: 88,
        color: palette.green,
        stack: ["Neo4j", "RAG", "LLM", "Python", "OCR"],
        proof: "Turned PDF documents into Neo4j-backed knowledge graphs with layout-aware OCR, semantic chunking, triplet extraction, and hybrid retrieval for grounded answer generation."
    },
    {
        name: "Graph-Based Analytics on NYC Taxi Data",
        category: "systems",
        size: 82,
        color: palette.blue,
        stack: ["Kafka", "Neo4j", "Kubernetes", "Spark", "PostgreSQL"],
        proof: "Modeled NYC Yellow Taxi trips as a graph and built a cloud-native analytics pipeline using Kafka streaming, Neo4j GDS, SparkSQL, PostgreSQL bulk loading, and Helm on Kubernetes."
    },
    {
        name: "NBA Viewership Decline",
        category: "d3",
        size: 92,
        color: palette.gold,
        stack: ["D3.js", "React", "Scrollytelling", "Heat Maps"],
        proof: "Built 8 interactive visualizations, including tug-of-war charts, fan funnel views, decline trends, and shot heat maps with scroll-triggered transitions and mobile-friendly behavior."
    },
    {
        name: "Automated Warehouse Scenario",
        category: "mlai",
        size: 74,
        color: "#7c6f64",
        stack: ["ASP", "Clingo", "Logic Programming", "Planning"],
        proof: "Implemented multi-agent warehouse planning with collision avoidance, shelf carrying, product delivery, and optimized time steps using Answer Set Programming."
    }
];

const networkNodes = [
    { id: "PVS", group: "core", radius: 34 },
    { id: "D3.js", group: "skill", radius: 26 },
    { id: "React", group: "skill", radius: 21 },
    { id: "FastAPI", group: "skill", radius: 20 },
    { id: "Next.js", group: "skill", radius: 20 },
    { id: "Gemini", group: "skill", radius: 19 },
    { id: "Neo4j", group: "skill", radius: 19 },
    { id: "travelMate", group: "project", radius: 26 },
    { id: "AI Stylist", group: "project", radius: 23 },
    { id: "Accio", group: "project", radius: 23 },
    { id: "NBA Story", group: "project", radius: 24 }
];

const networkLinks = [
    ["PVS", "D3.js"], ["PVS", "React"], ["PVS", "FastAPI"], ["PVS", "Next.js"], ["PVS", "Gemini"], ["PVS", "Neo4j"],
    ["Next.js", "travelMate"], ["FastAPI", "travelMate"], ["Gemini", "travelMate"],
    ["React", "NBA Story"], ["D3.js", "NBA Story"], ["Gemini", "AI Stylist"], ["Neo4j", "Accio"]
].map(([source, target]) => ({ source, target }));

const skillData = [
    { axis: "SDE systems", value: 90 },
    { axis: "ML / AI workflows", value: 92 },
    { axis: "Frontend craft", value: 88 },
    { axis: "Backend APIs", value: 91 },
    { axis: "D3 storytelling", value: 86 },
    { axis: "Product polish", value: 89 }
];

const timelineData = [
    { label: "BHEL", year: 2020.4, detail: "Web development intern" },
    { label: "BlueJeans", year: 2021.6, detail: "Frontend intern" },
    { label: "BITS Pilani", year: 2022.4, detail: "B.Tech Computer Science" },
    { label: "Darwinbox", year: 2022.8, detail: "Software Development Engineer" },
    { label: "ASU MSCS", year: 2024.7, detail: "ML, AI, and visualization focus" },
    { label: "Full-Time Search", year: 2026.1, detail: "SDE and ML/AI roles" }
];

function initNavigation() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}

function initCursorGlow() {
    const glow = document.querySelector(".cursor-glow");
    if (!glow) return;
    window.addEventListener("pointermove", (event) => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
    });
}

function animateCounters() {
    const counters = document.querySelectorAll("[data-count]");
    const formatter = new Intl.NumberFormat("en-US");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const node = entry.target;
            const target = Number(node.dataset.count);
            d3.select(node)
                .transition()
                .duration(1400)
                .tween("text", function () {
                    const interpolate = d3.interpolateNumber(0, target);
                    return (t) => {
                        this.textContent = formatter.format(Math.round(interpolate(t)));
                    };
                });
            observer.unobserve(node);
        });
    }, { threshold: 0.6 });

    counters.forEach((counter) => observer.observe(counter));
}

function renderProjectBubbles(activeFilter = "all") {
    const svg = d3.select("#project-bubbles");
    const details = d3.select("#project-details");
    if (svg.empty() || details.empty()) return;
    svg.selectAll("*").remove();

    const width = svg.node().clientWidth || 760;
    const height = svg.node().clientHeight || 560;
    const filtered = activeFilter === "all" ? projects : projects.filter((d) => d.category === activeFilter);
    const data = filtered.map((d) => ({ ...d }));
    const radius = d3.scaleSqrt().domain([50, 100]).range([42, 92]);

    const pack = d3.pack()
        .size([width - 24, height - 24])
        .padding(14);

    const root = d3.hierarchy({ children: data }).sum((d) => d.size);
    const leaves = pack(root).leaves();

    const groups = svg.append("g")
        .attr("transform", "translate(12,12)")
        .selectAll("g")
        .data(leaves, (d) => d.data.name)
        .join("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .attr("opacity", 0);

    groups.transition()
        .duration(550)
        .attr("opacity", 1);

    groups.append("circle")
        .attr("r", 0)
        .attr("fill", (d) => d.data.color)
        .attr("fill-opacity", 0.88)
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .transition()
        .duration(700)
        .ease(d3.easeCubicOut)
        .attr("r", (d) => Math.min(d.r, radius(d.data.size)));

    groups.append("text")
        .attr("class", "node-label")
        .attr("text-anchor", "middle")
        .attr("font-weight", 800)
        .attr("font-size", 12)
        .selectAll("tspan")
        .data((d) => wrapWords(d.data.name, Math.max(10, Math.floor(d.r / 5))))
        .join("tspan")
        .attr("x", 0)
        .attr("dy", (_, i, nodes) => i === 0 ? `${-(nodes.length - 1) * 0.6}em` : "1.2em")
        .text((d) => d);

    groups.append("text")
        .attr("class", "node-label mono-label")
        .attr("text-anchor", "middle")
        .attr("y", (d) => Math.min(d.r, radius(d.data.size)) - 16)
        .attr("fill", "white")
        .attr("font-size", 11)
        .text((d) => d.data.category);

    groups
        .style("cursor", "pointer")
        .on("mouseenter focus", (_, d) => setProjectDetails(d.data))
        .on("click", (_, d) => setProjectDetails(d.data));

    setProjectDetails(filtered[0]);
}

function wrapWords(text, maxChars) {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    words.forEach((word) => {
        const next = line ? `${line} ${word}` : word;
        if (next.length > maxChars && line) {
            lines.push(line);
            line = word;
        } else {
            line = next;
        }
    });
    if (line) lines.push(line);
    return lines.slice(0, 3);
}

function setProjectDetails(project) {
    if (!project) return;
    const details = d3.select("#project-details");
    details.html("");
    const categoryLabels = {
        sde: "SDE",
        mlai: "ML / AI",
        d3: "D3",
        systems: "Systems"
    };

    details.append("p").attr("class", "eyebrow").text(categoryLabels[project.category] || project.category);
    details.append("h3").text(project.name);
    details.append("p").text(project.proof);
    const row = details.append("div").attr("class", "tag-row");
    row.selectAll("span")
        .data(project.stack)
        .join("span")
        .text((d) => d);
}

function initProjectFilters() {
    d3.selectAll(".filter-btn").on("click", function () {
        const filter = this.dataset.filter;
        d3.selectAll(".filter-btn").classed("active", false);
        d3.select(this).classed("active", true);
        renderProjectBubbles(filter);
    });
}

function renderSkillRadar() {
    const svg = d3.select("#skill-radar");
    if (svg.empty()) return;
    svg.selectAll("*").remove();

    const width = svg.node().clientWidth || 520;
    const height = svg.node().clientHeight || 448;
    const margin = 56;
    const radius = Math.min(width, height) / 2 - margin;
    const center = { x: width / 2, y: height / 2 };
    const angle = (axis) => {
        const index = skillData.findIndex((d) => d.axis === axis);
        return (index / skillData.length) * Math.PI * 2;
    };
    const radial = d3.scaleLinear().domain([0, 100]).range([0, radius]);
    const line = d3.lineRadial()
        .angle((d) => angle(d.axis))
        .radius((d) => radial(d.value))
        .curve(d3.curveLinearClosed);

    const g = svg.append("g").attr("transform", `translate(${center.x},${center.y})`);

    [20, 40, 60, 80, 100].forEach((tick) => {
        g.append("circle")
            .attr("r", radial(tick))
            .attr("fill", "none")
            .attr("stroke", "rgba(16,20,24,0.12)");
    });

    skillData.forEach((d) => {
        const a = angle(d.axis) - Math.PI / 2;
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius;
        g.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", x)
            .attr("y2", y)
            .attr("stroke", "rgba(16,20,24,0.14)");

        g.append("text")
            .attr("class", "axis-label")
            .attr("x", Math.cos(a) * (radius + 24))
            .attr("y", Math.sin(a) * (radius + 24))
            .attr("text-anchor", Math.cos(a) > 0.25 ? "start" : Math.cos(a) < -0.25 ? "end" : "middle")
            .attr("font-size", 12)
            .attr("font-weight", 800)
            .text(d.axis);
    });

    const path = g.append("path")
        .datum(skillData)
        .attr("d", line)
        .attr("fill", palette.teal)
        .attr("fill-opacity", 0.2)
        .attr("stroke", palette.teal)
        .attr("stroke-width", 3);

    const totalLength = path.node().getTotalLength();
    path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1200)
        .ease(d3.easeCubicOut)
        .attr("stroke-dashoffset", 0);

    g.selectAll(".radar-dot")
        .data(skillData)
        .join("circle")
        .attr("class", "radar-dot")
        .attr("cx", (d) => Math.cos(angle(d.axis) - Math.PI / 2) * radial(d.value))
        .attr("cy", (d) => Math.sin(angle(d.axis) - Math.PI / 2) * radial(d.value))
        .attr("r", 0)
        .attr("fill", palette.coral)
        .transition()
        .delay(500)
        .duration(500)
        .attr("r", 5);
}

function renderTimeline() {
    const svg = d3.select("#career-timeline");
    if (svg.empty()) return;
    svg.selectAll("*").remove();

    const width = svg.node().clientWidth || 900;
    const height = svg.node().clientHeight || 288;
    const margin = { top: 54, right: 34, bottom: 56, left: 34 };
    const x = d3.scaleLinear()
        .domain([2019.8, 2026])
        .range([margin.left, width - margin.right]);
    const y = height / 2;

    svg.append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", y)
        .attr("y2", y)
        .attr("stroke", "rgba(255,255,255,0.28)")
        .attr("stroke-width", 2);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(7))
        .call((g) => g.select(".domain").remove())
        .call((g) => g.selectAll("text").attr("class", "mono-label").attr("font-weight", 800));

    const groups = svg.selectAll(".timeline-node")
        .data(timelineData)
        .join("g")
        .attr("class", "timeline-node")
        .attr("transform", (d, i) => `translate(${x(d.year)},${y + (i % 2 === 0 ? -28 : 28)})`);

    groups.append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", (d, i) => i % 2 === 0 ? 28 : -28)
        .attr("y2", 0)
        .attr("stroke", "rgba(255,255,255,0.24)");

    groups.append("circle")
        .attr("r", 0)
        .attr("fill", (d, i) => [palette.teal, palette.coral, palette.green, palette.gold, palette.blue, palette.ink][i])
        .transition()
        .delay((_, i) => i * 100)
        .duration(600)
        .attr("r", 10);

    groups.append("text")
        .attr("class", "timeline-label")
        .attr("text-anchor", "middle")
        .attr("y", (d, i) => i % 2 === 0 ? -18 : 28)
        .attr("font-size", 13)
        .attr("font-weight", 800)
        .text((d) => d.label);

    groups.append("text")
        .attr("class", "timeline-label")
        .attr("text-anchor", "middle")
        .attr("y", (d, i) => i % 2 === 0 ? -1 : 45)
        .attr("font-size", 11)
        .attr("fill", palette.muted)
        .text((d) => d.detail);
}

function renderWorkNetwork() {
    const svg = d3.select("#work-network");
    if (svg.empty()) return;
    svg.selectAll("*").remove();

    const width = svg.node().clientWidth || 700;
    const height = svg.node().clientHeight || 600;
    const linkData = networkLinks.map((d) => ({
        source: typeof d.source === "object" ? d.source.id : d.source,
        target: typeof d.target === "object" ? d.target.id : d.target
    }));
    const color = d3.scaleOrdinal()
        .domain(["core", "skill", "project"])
        .range([palette.ink, palette.teal, palette.coral]);

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "workLinkGradient")
        .attr("x1", "0%")
        .attr("x2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", palette.teal);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", palette.coral);

    const links = svg.append("g")
        .attr("stroke", "url(#workLinkGradient)")
        .attr("stroke-opacity", 0.38)
        .selectAll("line")
        .data(linkData)
        .join("line")
        .attr("stroke-width", 2);

    const nodes = svg.append("g")
        .selectAll("g")
        .data(networkNodes.map((d) => ({ ...d })))
        .join("g")
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded));

    nodes.append("circle")
        .attr("r", (d) => d.radius)
        .attr("fill", (d) => color(d.group))
        .attr("fill-opacity", (d) => d.group === "core" ? 1 : 0.9)
        .attr("stroke", "white")
        .attr("stroke-width", 3);

    nodes.append("text")
        .attr("class", "node-label")
        .attr("text-anchor", "middle")
        .attr("dy", (d) => d.radius + 17)
        .attr("font-size", 12)
        .attr("font-weight", 800)
        .text((d) => d.id);

    const simulation = d3.forceSimulation(nodes.data())
        .force("link", d3.forceLink(linkData).id((d) => d.id).distance((d) => d.source.id === "PVS" ? 130 : 105))
        .force("charge", d3.forceManyBody().strength(-450))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius((d) => d.radius + 24))
        .on("tick", () => {
            links
                .attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);

            nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
        });

    function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

function renderAllCharts() {
    renderWorkNetwork();
    renderProjectBubbles("all");
    renderSkillRadar();
    renderTimeline();
}

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initCursorGlow();
    animateCounters();
    initProjectFilters();
    renderAllCharts();

    let resizeTimer;
    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(renderAllCharts, 180);
    });
});
