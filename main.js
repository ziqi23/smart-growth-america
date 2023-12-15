import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function main() {
    await handlePolicyLocation();

    // Set up constants
    let policyType;
    let email;
    let organization;
    let highlight;
    let draft;
    let file;
    let state;
    let county;
    let city;
    let mpo;
    const acceptedFileTypes = ["doc", "docx", "pdf"];
    const startPage = document.getElementById("get-started-page");
    const uploadPage = document.getElementById("upload-page");
    const uploadBlock = document.getElementById("upload-field-drag-drop");
    const uploadButton = document.getElementById("upload-page-drag-drop-container-bottom");
    const scoreFill = document.getElementById("score-tracker-bar-fill");
    const element1 = document.getElementById("element-one");
    const element2 = document.getElementById("element-two");
    const element3 = document.getElementById("element-three");
    const element4 = document.getElementById("element-four");
    const element5 = document.getElementById("element-five");
    const element6 = document.getElementById("element-six");
    const element7 = document.getElementById("element-seven");
    const element8 = document.getElementById("element-eight");
    const element9 = document.getElementById("element-nine");
    const element10 = document.getElementById("element-ten");
    const submissionPage = document.getElementById("submission-page");
    const elementHeader = document.getElementById("element-header");
    const progressBar = document.getElementById("progress");
    const navbar = document.getElementById("element-navbar-score");
    const banner = document.getElementById("element-navbar-banner");
    const scoreTracker = document.getElementById("score-tracker");
    const elementFooter = document.getElementById("element-footer");
    const downloadButton = document.getElementById("download");

    // Track questions under each element
    const elementMapping = {
        "get-started-page": [],
        "upload-page": [],
        "element-one": ["element-1a", "element-1b", "element-1c", "element-1d", "element-1e"],
        "element-two": ["element-2a", "element-2b"],
        "element-three": ["element-3a", "element-3b", "element-3c", "element-3d", "element-3e"],
        "element-four": ["element-4a", "element-4b", "element-4c"],
        "element-five": ["element-5a", "element-5b", "element-5c"],
        "element-six": ["element-6a", "element-6b"],
        "element-seven": ["element-7a", "element-7b", "element-7c", "element-7d"],
        "element-eight": ["element-8a", "element-8b", "element-8c", "element-8d", "element-8e", "element-8f"],
        "element-nine": ["element-9a", "element-9b"],
        "element-ten": ["element-10a", "element-10b", "element-10c", "element-10d"],
        "submission-page": []
    }

    // Track navbar content
    const navbarMapping = {
        "element-one": ["Element 1: Establishes commitment and vision (12 points)", "How and why does the community want to complete its streets? This specifies a clear statement of intent to create a complete, connected network and consider the needs of all users."],
        "element-two": ["Element 2: Prioritizes underinvested and underserved communities (9 points)", "Requires jurisdictions to define who are their most underinvested and underserved communities and prioritize them throughout."],
        "element-three": ["Element 3: Applies to all projects and phases (10 points)", "Instead of a limited set of projects, the policy applies to all new projects, retrofit or reconstruction projects, maintenance projects, and ongoing operations. "],
        "element-four": ["Element 4: Allows only clear exceptions (8 points)", "Any exceptions must be specific, with a clear procedure that requires high-level approval and public notice prior to exceptions being granted."],
        "element-five": ["Element 5: Mandates coordination (8 points)", "Any exceptions must be specific, with a clear procedure that requires high-level approval and public notice prior to exceptions being granted."],
        "element-six": ["Element 6: Adopts excellent design guidance (7 points)", "Directs agencies to use the latest and best design criteria and guidelines, and sets a time frame for implementing this guidance."],
        "element-seven": ["Element 7: Requires proactive land-use planning (10 points)", "Considers every project’s greater context, as well as the surrounding community’s current and expected land-use and transportation needs."],
        "element-eight": ["Element 8: Measures progress (13 points)", "Directs agencies to use the latest and best design criteria and guidelines, and sets a time frame for implementing this guidance."],
        "element-nine": ["Element 9: Sets criteria for choosing projects (8 points)", "Creates or updates the criteria for choosing transportation projects so that Complete Streets projects are prioritized."],
        "element-ten": ["Element 10: Creates a plan for implementation (15 points)", "A formal commitment to the Complete Streets approach is only the beginning. It must include specific steps for implementing the policy in ways that will make a measurable impact on what gets built and where."],
        "submission-page": ["Thank you for grading your policy!", "The information in your score details below will offer valuable insights into the performance of your policy across each element, also allow for a meaningful comparison with other policies"]
    }

    // Track maximum possible score per element
    const maxScore = {
        "element-one": 12,
        "element-two": 9,
        "element-three": 10,
        "element-four": 8,
        "element-five": 8,
        "element-six": 7,
        "element-seven": 10,
        "element-eight": 13,
        "element-nine": 8,
        "element-ten": 15,
    }

    // Track policy type for form conditional logic
    const policySpecificQuestions = {
        "element-3a": "Municipality/County",
        "element-3b": "Municipality/County",
        "element-3c": "MPO/State",
        "element-3d": "MPO/State",
        "element-5a": "Municipality/County",
        "element-5b": "MPO/State",
        "element-7a": "Municipality/County",
        "element-7b": "MPO/State",
    }

    // Track ordering of pages and current page displayed
    const allPages = [
        startPage,
        uploadPage,
        element1,
        element2,
        element3,
        element4,
        element5,
        element6,
        element7,
        element8,
        element9,
        element10,
        submissionPage
    ];
    let currentPageIdx = 0;
    let elementScore = 0;
    let scores = {};


    // Add error handling
    Object.values(elementMapping).forEach(page => {
        page.forEach(question => {
            const errorNode = document.createElement("div");

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "20");
            svg.setAttribute("height", "20");
            svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M18.6792 14.5385L11.9292 3.10973C11.523 2.42126 10.7902 2 10 2C9.2098 2 8.47697 2.42149 8.07084 3.10973L1.32081 14.5385C0.90343 15.2448 0.892855 16.1241 1.29178 16.8402C1.69183 17.5573 2.43974 18 3.24997 18H16.75C17.5605 18 18.3084 17.5573 18.7082 16.8402C19.1071 16.1241 19.0966 15.2445 18.6792 14.5385ZM10 5.42839C10.6212 5.42839 11.125 5.94017 11.125 6.57127V11.1428C11.125 11.7739 10.6212 12.2856 10 12.2856C9.37877 12.2856 8.875 11.7739 8.875 11.1428V6.57127C8.875 5.94017 9.37877 5.42839 10 5.42839ZM8.875 14.5714C8.875 13.9403 9.37877 13.4285 10 13.4285C10.6212 13.4285 11.125 13.9403 11.125 14.5714C11.125 15.2025 10.6212 15.7143 10 15.7143C9.37877 15.7143 8.875 15.2027 8.875 14.5714Z");
            path.setAttribute("fill", "red");
            svg.appendChild(path);

            const div = document.createElement("div");
            div.innerHTML = "Please grade this item.";

            errorNode.appendChild(svg);
            errorNode.appendChild(div);
            errorNode.classList.add("error-node");
            document.getElementById(question).appendChild(errorNode);
        })
    })
    const div = document.createElement("div");
    div.innerHTML = "* Required";
    div.style.color = "#FF2121";
    div.style.fontSize = "14px";
    div.style.fontWeight = "300";
    div.style.fontStyle = "italic";
    div.style.marginLeft = "8px";
    div.style.display = "none";
    const getStartedPagefields = document.getElementsByClassName("get-started-page-survey-label");
    const uploadPageFields = document.getElementsByClassName("upload-page-question");
    for (let i = 0; i < getStartedPagefields.length; i++) {
        getStartedPagefields[i].appendChild(div.cloneNode(true));
    }
    for (let i = 0; i < uploadPageFields.length; i++) {
        uploadPageFields[i].appendChild(div.cloneNode(true));
    }

    // Check type of policy, only display relevant questions based on type (State/MPO or Municipality/County)
    // Show questions only when relevant to current policy type
    let radios = document.getElementsByName('policy')
    radios.forEach(radio => {
        radio.addEventListener("click", () => {
            if (radio.checked) {
                policyType = radio.value;
                if (policyType === "Municipality/County") {
                    // Update survey questions
                    document.querySelectorAll(".mpo-state").forEach(node => {
                        node.style.display = "none";
                    })
                    document.querySelectorAll(".municipality-county").forEach(node => {
                        node.style.display = "block";
                    })
    
                    // Update policy location dropdown
                    document.getElementById("policy-mpo").style.display = "none";
                    document.getElementById("policy-county").style.display = "flex";
                    document.getElementById("policy-city").style.display = "flex";
                }
                if (policyType === "MPO/State") {
    
                    // Update survey questions
                    document.querySelectorAll(".municipality-county").forEach(node => {
                        node.style.display = "none";
                    })
                    document.querySelectorAll(".mpo-state").forEach(node => {
                        node.style.display = "block";
                    })
    
                    // Update policy location dropdown
                    document.getElementById("policy-county").style.display = "none";
                    document.getElementById("policy-city").style.display = "none";
                    document.getElementById("policy-mpo").style.display = "flex";
                }
    
                // Remove non-relevant questions
                for (const [key, val] of Object.entries(policySpecificQuestions)) {
                    if (val !== policyType) {
                        delete scores[key];
                    }
                }
            }
        })
    })

    // Add event listener to "next" buttons
    // 1) Only proceed if all questions answered, otherwise show error
    // 2) Update content displayed
    document.querySelectorAll("#next").forEach(button => {
        button.addEventListener("click", () => {
            window.scrollTo(0, 0);

            // Track current and next page
            const currentPage = allPages[currentPageIdx];
            const nextPage = allPages[currentPageIdx + 1];
            const currentPageId = currentPage.id;
            const nextPageId = nextPage.id;

            // Show error if not all questions answered
            let flag = true;
            elementMapping[currentPageId].forEach(question => {
                if ((policySpecificQuestions[question] === undefined ||
                    policySpecificQuestions[question] === policyType) &&
                    scores[question] === undefined) {
                    document.getElementById(question).lastChild.style.display = "flex";
                    document.querySelectorAll(`#${question} input`).forEach(node => {
                        node.style.outline = "1px auto red";
                    })
                    flag = false;
                }
            })

            // Handle get started page errors
            const policyTypeNode = document.querySelectorAll(".get-started-page-survey-label div")[0];
            const emailNode = document.querySelectorAll(".get-started-page-survey-label div")[1];
            const organizationNode = document.querySelectorAll(".get-started-page-survey-label div")[2];
            policyTypeNode.style.display = "none";
            emailNode.style.display = "none";
            organizationNode.style.display = "none";
            if (!policyType) {
                policyTypeNode.style.display = "block";
                flag = false;
            }

            if (!email) {
                emailNode.style.display = "block";
                flag = false;
            }
            if (!organization) {
                organizationNode.style.display = "block";
                flag = false;
            }

            // Handle upload page errors
            const highlightQuestion = document.querySelectorAll(".upload-page-question div")[0];
            const draftQuestion = document.querySelectorAll(".upload-page-question div")[1];
            const locationQuestion = document.querySelectorAll(".upload-page-question div")[2];
            highlightQuestion.style.display = "none";
            draftQuestion.style.display = "none";
            locationQuestion.style.display = "none";
            if (nextPageId === "element-one" && (!highlight || !file)) {
                highlightQuestion.style.display = "block";
                flag = false;
            }

            if (nextPageId === "element-one" && !draft) {
                draftQuestion.style.display = "block";
                flag = false;
            }
            if (nextPageId === "element-one" && !state) {
                locationQuestion.style.display = "block";
                flag = false;
            }

            // If no errors, move to next page
            if (flag) {
                currentPage.style.display = "none";
                nextPage.style.display = "block";
                     
                // Update element score tracker
                elementScore = 0;
                elementMapping[nextPageId].forEach(question => {
                    if (scores[question]) elementScore += scores[question];
                })
                scoreTracker.innerHTML = elementScore;
                scoreFill.style.width = `${Math.min(elementScore / maxScore[nextPageId] * 100)}%`;
                
                // Update navbar visibility
                if (nextPageId === "upload-page") {
                    elementHeader.style.display = "none";
                    elementFooter.style.display = "none";
                }
                else if (nextPageId === "submission-page") {
                    progressBar.style.display = "none";
                    navbar.style.display = "none";
                    elementFooter.style.display = "none";
                    downloadButton.style.display = "flex";
                    banner.style.paddingLeft = "calc((100vw - 1038px) / 2)";
                    banner.style.paddingRight = "calc((100vw - 1038px) / 2)";
                    downloadButton.addEventListener("click", () => saveImage(scores));
                }
                else {
                    elementHeader.style.display = "block";
                    elementFooter.style.display = "block";
                }

                // Update button text
                if (nextPageId === "element-ten") {
                    const nextButton = document.querySelectorAll("#element-footer #next")[0];
                    nextButton.innerHTML = "Submit";
                }

                // Update navbar language
                if (navbarMapping[nextPageId]) {
                    const navbars = document.querySelectorAll("#element-navbar-banner-left");
                    for (let i = 0; i < navbars.length; i++) {
                        navbars[i].firstElementChild.innerHTML = navbarMapping[nextPageId][0];
                        navbars[i].lastElementChild.innerHTML = navbarMapping[nextPageId][1];
                    }
                }

                // Update header progress bar
                for (let child of progressBar.children) {
                    if (child.name === nextPageId) {
                        child.checked = true;
                    }
                    else {
                        child.checked = false;
                    }
                }
                
                // If form submitted, show results
                if (nextPageId === "submission-page") {
                    
                    submissionPage.style.display = "flex";
                    
                    getAverageScore(state).then(res => {
                        document.getElementById("average-state-score").innerHTML = `Average policy score (${state}): ${res}`;
                        showAverageScore(res);
                        postScore(state, scores);
                    })
                    handleUpload({
                        scores, 
                        state, 
                        county, 
                        city, 
                        mpo,
                        policyType, 
                        email, 
                        organization, 
                        highlight, 
                        draft
                    });
                    showDataVisualization(scores);
                    showDataVisualizationMobile(scores);
                }

                currentPageIdx++;
            }
        })
    })

    // Add event listener to "prev" buttons
    // 1) Update content displayed
    document.querySelectorAll("#prev").forEach(element => {
        element.addEventListener("click", () => {
            window.scrollTo(0, 0);

            // Track current and previous page
            const currentPage = allPages[currentPageIdx];
            const prevPage = allPages[currentPageIdx - 1];
            const currentPageId = currentPage.id;
            const prevPageId = prevPage.id;

            // Update navbar language
            if (navbarMapping[prevPageId]) {
                const navbar = document.getElementById("element-navbar-banner-left");
                navbar.firstElementChild.innerHTML = navbarMapping[prevPageId][0];
                navbar.lastElementChild.innerHTML = navbarMapping[prevPageId][1];
            }

            // Update element score tracker
            elementScore = 0;
            elementMapping[prevPage.id].forEach(question => {
                if (scores[question]) elementScore += scores[question];
            })
            scoreTracker.innerHTML = elementScore;
            scoreFill.style.width = `${Math.min(elementScore / maxScore[prevPageId] * 100)}%`;

            // Move to previous page
            currentPage.style.display = "none";
            if (currentPageIdx === 1) {
                prevPage.style.display = "flex";
            }
            else {
                prevPage.style.display = "block";
            }
            
            // Remove navbar if returning to upload page
            if (currentPageIdx < 3) {
                elementHeader.style.display = "none";
                elementFooter.style.display = "none";
            }

            // Update button text
            if (prevPageId === "element-nine") {
                const nextButton = document.querySelectorAll("#element-footer #next")[0];
                nextButton.innerHTML = "Next";
            }

            // Remove any remaining error handlers
            elementMapping[prevPageId].forEach(question => {
                document.getElementById(question).lastChild.style.display = "none";
                document.querySelectorAll(`#${question} input`).forEach(node => {
                    node.style.outline = "inherit";
                })
            })

            // Update progress bar
            for (let child of progressBar.children) {
                if (child.name === prevPageId) {
                    child.checked = true;
                }
                else {
                    child.checked = false;
                }
            }

            currentPageIdx--;
        })
    })

    // Handle file drag and drop
    uploadBlock.addEventListener("dragenter", handleDrag);
    uploadBlock.addEventListener("dragover", handleDrag);
    uploadBlock.addEventListener("drop", handleDrag);
    uploadBlock.addEventListener("dragleave", handleDrag);

    function handleDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        switch (e.type) {
            case "dragover":
                break;
            case "dragenter":
                break;
            case "drop":
                try {
                    file = e.dataTransfer.files[0];
                    const fileExtension = file.name.split(".")[1];
                    if (!acceptedFileTypes.includes(fileExtension)) {
                        throw new Error();
                    }
                    const svg = uploadBlock.firstElementChild;
                    const div = uploadBlock.lastElementChild;

                    svg.setAttribute("width", "69");
                    svg.setAttribute("height", "69");
                    svg.setAttribute("viewBox", "0 0 69 69")
                    svg.removeChild(svg.firstElementChild);

                    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    circle.setAttribute("cx", "34.5");
                    circle.setAttribute("cy", "34.5");
                    circle.setAttribute("r", "34.5");
                    circle.setAttribute("fill", "#00B227");
                    
                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", "M19 32.9053L27.5171 47L54 21");
                    path.setAttribute("stroke", "white");
                    path.setAttribute("stroke-width", "4");
                
                    svg.appendChild(circle);
                    svg.appendChild(path);

                    uploadButton.innerHTML = "Replace";
                    div.innerHTML = "File Upload Success";
                    div.style.color = "#282828";
                }
                catch {
                    const svg = uploadBlock.firstElementChild;
                    const div = uploadBlock.lastElementChild;

                    svg.setAttribute("width", "69");
                    svg.setAttribute("height", "69");
                    svg.setAttribute("viewBox", "0 0 69 69")
                    svg.removeChild(svg.firstElementChild);

                    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    circle.setAttribute("cx", "34.5");
                    circle.setAttribute("cy", "34.5");
                    circle.setAttribute("r", "34.5");
                    circle.setAttribute("fill", "#D60707");
                    
                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", "M23.2912 46.2909L47.2911 22.2909");
                    path.setAttribute("stroke", "white");
                    path.setAttribute("stroke-width", "4");

                    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path2.setAttribute("d", "M23.2912 22.2911L47.2911 46.2911");
                    path2.setAttribute("stroke", "white");
                    path2.setAttribute("stroke-width", "4");
                
                    svg.appendChild(circle);
                    svg.appendChild(path);
                    svg.appendChild(path2);

                    uploadButton.innerHTML = "Try Again";
                    div.innerHTML = "File Upload Failed";
                    div.style.color = "#282828";
                }
                break;
            case "dragleave":
                break;
            default:
                break;
        }
    }

    // Handle traditional file upload;
    document.getElementById("file-upload").addEventListener("change", (e) => {
        if (e.target.files[0]) {
            file = e.target.files[0];
            const svg = uploadBlock.firstElementChild;
            const div = uploadBlock.lastElementChild;

            svg.setAttribute("width", "69");
            svg.setAttribute("height", "69");
            svg.setAttribute("viewBox", "0 0 69 69")
            svg.removeChild(svg.firstElementChild);

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", "34.5");
            circle.setAttribute("cy", "34.5");
            circle.setAttribute("r", "34.5");
            circle.setAttribute("fill", "#00B227");
            
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M19 32.9053L27.5171 47L54 21");
            path.setAttribute("stroke", "white");
            path.setAttribute("stroke-width", "4");
        
            svg.appendChild(circle);
            svg.appendChild(path);

            uploadButton.innerHTML = "Replace";
            div.innerHTML = "File Upload Success";
            div.style.color = "#282828";
        }
    })
    uploadButton.addEventListener("click", () => {
        document.getElementById("file-upload").click();
    })

    // Add pill shaped visual to show point value associated with each option
    document.querySelectorAll("#radio-response-container > label").forEach(element => {
        const value = element.childNodes[0].getAttribute("value");
        const childNode = document.createElement("div");
        childNode.innerHTML = `${value} ${parseInt(value) !== 1 ? "pts" : "pt"}`;
        element.parentElement.appendChild(childNode);
    })

    // Update policy score when user makes a selection
    const inputElements = document.getElementsByTagName("input")
    const radioButtons = Array.from(inputElements).filter(ele => ele.type === "radio" && !isNaN(parseInt(ele.value)));
    for (let element of radioButtons) {
        element.addEventListener("click", handleSelectRadioButton);
    }

    function handleSelectRadioButton(e) {
        // Error handling
        const parent = document.getElementById(e.target.name)
        if (parent) {
            parent.lastElementChild.style.display = "none";
            document.querySelectorAll(`#${parent.id} input`).forEach(input => {
                input.style.outline = "inherit";
            })
        }

        // Update scores object
        const section = e.target.getAttribute("name");
        const pointValue = parseInt(e.target.getAttribute("value"));
        scores[section] = pointValue;

        // Update current element score
        let currentElementScore = 0;
        let element = Object.keys(elementMapping).filter(key => (elementMapping[key].includes(section)))[0];
        if (!element) return;
        for (let question of elementMapping[element]) {
            if (scores[question]) currentElementScore += scores[question];

        }
        scoreTracker.innerHTML = currentElementScore;
        scoreFill.style.width = `${Math.min(currentElementScore / maxScore[element] * 100)}%`;

        // Update total score
        let totalScore = 0;
        for (let score of Object.values(scores)) {
            totalScore += score;
        }

        // Update stars UI
        const starContainer = document.getElementById(e.target.name).children[0];
        const numChildren = starContainer.children.length - 1;
        for (let i = 1; i <= pointValue; i++) {
            starContainer.children[i].children[0].children[0].style.fill = "#0082C8";
        }
        if (pointValue < numChildren) {
            for (let j = pointValue + 1; j <= numChildren; j++) {
                starContainer.children[j].children[0].children[0].style.fill = "#B1B1B1";
            }
        }
    }

    // Handle back to homepage button
    document.getElementById("back-to-homepage").addEventListener("click", () => {
        location.reload();
    })

    // Track user response
    document.getElementsByName("policy").forEach(input => {
        input.addEventListener("click", () => {
            policyType = input.value;
        })
    })

    document.getElementsByName("email").forEach(input => {
        input.addEventListener("change", () => {
            email = input.value;
        })
    })

    document.getElementsByName("organization").forEach(input => {
        input.addEventListener("change", () => {
            organization = input.value;
        })
    })

    document.getElementsByName("highlight").forEach(input => {
        input.addEventListener("click", () => {
            highlight = input.value;
        })
    })

    document.getElementsByName("draft").forEach(input => {
        input.addEventListener("click", () => {
            draft = input.value;
        })
    })

    document.getElementById("policy-state-select").addEventListener("change", (e) => {
        state = e.target.value;
    })

    document.getElementById("policy-county-select").addEventListener("change", (e) => {
        county = e.target.value;
    })

    document.getElementById("policy-city-select").addEventListener("change", (e) => {
        city = e.target.value;
    })

    document.getElementById("policy-mpo-select").addEventListener("change", (e) => {
        mpo = e.target.value;
    })

    document.querySelectorAll("#star-container").forEach(node => {
        const numStars = node.getAttribute("value");
        for (let i = 0; i < numStars; i++) {
            const div = document.createElement("div");
            div.style.padding = "2px";

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "16");
            svg.setAttribute("height", "16");
            svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M15.5046 6.33696L10.9783 5.64802C10.7899 5.61941 10.6272 5.49543 10.543 5.31684L8.51877 1.02018C8.30663 0.569935 7.69395 0.569935 7.48181 1.02018L5.45756 5.31684C5.37342 5.49572 5.21066 5.61941 5.02225 5.64802L0.495947 6.33696C0.0217449 6.40921 -0.167495 7.01955 0.175674 7.37009L3.45095 10.7145C3.58723 10.8535 3.6493 11.0541 3.6173 11.2506L2.84406 15.9732C2.76296 16.468 3.25868 16.8451 3.68295 16.6116L7.73147 14.3818C7.90002 14.289 8.10112 14.289 8.26939 14.3818L12.3179 16.6116C12.7419 16.8451 13.2376 16.468 13.1568 15.9732L12.3836 11.2506C12.3513 11.0541 12.4136 10.8535 12.5499 10.7145L15.8252 7.37009C16.1684 7.01984 15.9786 6.40921 15.5046 6.33696Z");
            path.setAttribute("fill", "#B1B1B1");
            
            svg.appendChild(path);
            div.appendChild(svg);
            node.appendChild(div);
        }
    })
}

// Track user form response and handle upload to google spreadsheets
async function handleUpload(props) {
    const {scores, state, county, city, mpo, policyType, email, organization, highlight, draft} = props;

    const scoreByElement = {};

    for (let [key, val] of Object.entries(scores)) {
        const modifiedKey = "E" + key.slice(1, -1).replace("-", " ");
        scoreByElement[modifiedKey] = (scoreByElement[modifiedKey] || 0) + val;
    }

    let totalScore = Object.values(scores).reduce((acc, ele) => acc + ele);

    let jurisdiction;
    let type;
    if (policyType === "MPO/State") {
        jurisdiction = mpo;
        type = "MPO/State"
    }
    else {
        jurisdiction = `${county}, ${city}`;
        type = "County/City"
    }
    
    const googleFormsMapping = {
        "entry.1716026598": jurisdiction,
        "entry.69196267": state,
        "entry.590299588": organization,
        "entry.1430189724": email,
        "entry.317606731": type,
        "entry.1274696273": draft,
        "entry.1137177146": highlight,
        "entry.1969721725": scores["element-1a"] || 0,
        "entry.159689269": scores["element-1b"] || 0,
        "entry.1449928071": scores["element-1c"] || 0,
        "entry.1112099899": scores["element-1d"] || 0,
        "entry.403323317": scores["element-1e"] || 0,
        "entry.522397308": scoreByElement["Element 1"] || 0,
        "entry.1890762488": scores["element-2a"] || 0,
        "entry.1665157542": scores["element-2b"] || 0,
        "entry.815799702": scoreByElement["Element 2"] || 0,
        "entry.1398812295": scores["element-3a"] || 0,
        "entry.1871803865": scores["element-3b"] || 0,
        "entry.1313275421": scores["element-3c"] || 0,
        "entry.203831506": scores["element-3d"] || 0,
        "entry.389669269": scores["element-3e"] || 0,
        "entry.1640735619": scoreByElement["Element 3"] || 0,
        "entry.140830098": scores["element-4a"] || 0,
        "entry.954109655": scores["element-4b"] || 0,
        "entry.1043641049": scores["element-4c"] || 0,
        "entry.1214497672": scoreByElement["Element 4"] || 0,
        "entry.1370961002": scores["element-5a"] || 0,
        "entry.139776049": scores["element-5b"] || 0,
        "entry.1076289296": scores["element-5c"] || 0,
        "entry.1346592745": scoreByElement["Element 5"] || 0,
        "entry.233654636": scores["element-6a"] || 0,
        "entry.338402585": scores["element-6b"] || 0,
        "entry.448468347": scoreByElement["Element 6"] || 0,
        "entry.817220379": scores["element-7a"] || 0,
        "entry.616347985": scores["element-7b"] || 0,
        "entry.1442697884": scores["element-7c"] || 0,
        "entry.443996558": scores["element-7d"] || 0,
        "entry.2087341768": scoreByElement["Element 7"] || 0,
        "entry.490371653": scores["element-8a"] || 0,
        "entry.1906323236": scores["element-8b"] || 0,
        "entry.976160340": scores["element-8c"] || 0,
        "entry.802541628": scores["element-8d"] || 0,
        "entry.964299138": scores["element-8e"] || 0,
        "entry.187529254": scores["element-8f"] || 0,
        "entry.445045608": scoreByElement["Element 8"] || 0,
        "entry.1528854937": scores["element-9a"] || 0,
        "entry.221122678": scores["element-9b"] || 0,
        "entry.363027609": scoreByElement["Element 9"] || 0,
        "entry.318957976": scores["element-10a"] || 0,
        "entry.1896992351": scores["element-10b"] || 0,
        "entry.1149133072": scores["element-10c"] || 0,
        "entry.1795275299": scores["element-10d"] || 0,
        "entry.266934249": scoreByElement["Element 10"] || 0,
        "entry.1800630205": scoreByElement["Element 1"] || 0,
        "entry.51809739": scoreByElement["Element 2"] || 0,
        "entry.1192688678": scoreByElement["Element 3"] || 0,
        "entry.2023342743": scoreByElement["Element 4"] || 0,
        "entry.1984630125": scoreByElement["Element 5"] || 0,
        "entry.2001620832": scoreByElement["Element 6"] || 0,
        "entry.985610400": scoreByElement["Element 7"] || 0,
        "entry.1075062514": scoreByElement["Element 8"] || 0,
        "entry.1853000765": scoreByElement["Element 9"] || 0,
        "entry.768341702": scoreByElement["Element 10"] || 0,
        "entry.655141688": totalScore || 0,
    }

    for (const [key, val] of Object.entries(googleFormsMapping)) {
        document.getElementsByName(key)[0].value = val;
    }
    
    document.getElementById("submit").click();
}

// Generates state, county, city and MPO data for location dropdown
async function handlePolicyLocation() {

    Parse.initialize("h82EExhCX1ONh5rYqj9yWYgir9PRAxcCEQrjP8vI", "kTLXW17aFIrAtHFg3zBSBRWTplSqNbNpmeGHic5V");
    Parse.serverURL = "https://parseapi.back4app.com/"

    const selectState = document.getElementById("policy-state-select");
    const selectCounty = document.getElementById("policy-county-select");
    const selectCity = document.getElementById("policy-city-select");
    const selectMPO = document.getElementById("policy-mpo-select");

    const countiesByState = await getCounties();
    countiesByState.sort((a, b) => a.countyName.localeCompare(b.countyName));
    selectState.addEventListener("change", () => {
        // clear options under county
        while (selectCounty.childNodes.length > 2) {
            selectCounty.removeChild(selectCounty.lastChild);
        }
        while (selectMPO.childNodes.length > 2) {
            selectMPO.removeChild(selectMPO.lastChild);
        }
        const val = selectState.value;
        if (val) {
            const mpos = getMpoByState(val);
            mpos.forEach(mpo => {
                const option = document.createElement("option");
                option.value = mpo;
                option.innerHTML = mpo;
                selectMPO.appendChild(option);
            })
            countiesByState.forEach(county => {
                if (county.stateAbbreviation === val) {
                    const option = document.createElement("option");
                    option.value = county.countyName;
                    option.innerHTML = county.countyName;
                    selectCounty.appendChild(option);
                }
            })
        }
    })
    selectCounty.addEventListener("change", () => {
        while (selectCity.childNodes.length > 2) {
            selectCity.removeChild(selectCity.lastChild);
        }
        const val = selectCounty.value;
        if (val) {
            const query = new Parse.Query("cities");
            try {
                const cities = query.equalTo("county_name", val.split(" County")[0]);
                cities.find().then(res => {
                    res.sort((a, b) => (a.attributes.city).localeCompare(b.attributes.city));
                    res.forEach(city => {
                        const option = document.createElement("option");
                        option.value = city.attributes.city;
                        option.innerHTML = city.attributes.city;
                        selectCity.appendChild(option);
                    })
                })
            } catch (error) {
                console.log(`Failed to retrieve the object, with error code: ${error.message}`);
            }
        }
    })
}

// Get average score by state
async function getAverageScore(state) {
    let averageScore = 0;

    Parse.initialize("h82EExhCX1ONh5rYqj9yWYgir9PRAxcCEQrjP8vI", "kTLXW17aFIrAtHFg3zBSBRWTplSqNbNpmeGHic5V");
    Parse.serverURL = "https://parseapi.back4app.com/"

    const query = new Parse.Query("scores");
    try {
        const cities = query.equalTo("stateAbbreviation", state);
        const res = await cities.find()

        let score = 0;
        let entries = 0;
        res.forEach(entry => {
            score += parseInt(entry.attributes.score);
            entries++;
        })
        averageScore = Math.floor((score / entries) || 0);
        
    } catch (error) {
        console.log(`Failed to retrieve the object, with error code: ${error.message}`);
    }
    return averageScore;
    
}

// Show average score as a reference for users in the submision page
function showAverageScore(score) {
    document.getElementById("average-state-score").style.marginLeft =`${Math.floor(Math.min(score, 100) / 100 * 1018) - 310}px`
    document.getElementById("average-score-svg").style.marginLeft = `${Math.floor(Math.min(score, 100) / 100 * 1018)}px`
}

// Post a new score to the database
function postScore(state, scores) {

    const score = Object.values(scores).reduce((acc, ele) => acc + ele);

    const stateMapping = {
        "AL": "Alabama",
        "AK": "Alaska",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DC": "District of Columbia",
        "DE": "Delaware",
        "FL": "Florida",
        "GA": "Georgia",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    };

    if (!stateMapping[state] || score < 0 || score > 100) {
        return;
    }

    Parse.initialize("h82EExhCX1ONh5rYqj9yWYgir9PRAxcCEQrjP8vI", "kTLXW17aFIrAtHFg3zBSBRWTplSqNbNpmeGHic5V");
    Parse.serverURL = "https://parseapi.back4app.com/"

    const ScoreObject = Parse.Object.extend("scores");
    const newScore = new ScoreObject();
    newScore.set("stateAbbreviation", state);
    newScore.set("stateName", stateMapping[state]);
    newScore.set("score", `${score}`);
    newScore.save();
}

// Returns list of counties by state for location dropdown
async function getCounties() {

    const response = await fetch(
        'https://parseapi.back4app.com/classes/Uscounties_Area?limit=100000&keys=countyName,state,stateAbbreviation',
        {
          headers: {
            'X-Parse-Application-Id': 'u9vi2i6NrVXxAa1DEf9KVOIGRahaPi7ZHohL4ocI',
            'X-Parse-REST-API-Key': '0WQw5UsPqg9JaO4B4absvsy3JcKMSOoT5XxcXBfU',
          }
        }
    );
    const { results } = await response.json();
    return results;
}

// Returns list of MPOs by state for location dropdown
function getMpoByState(state) {

    const mposByState = {
        "AK": ["Anchorage Metropolitan Area Transportation Solutions (AMATS)", "Fairbanks Area Surface Transportation Planning (FAST Planning)"],
        "AL": ["Auburn - Opelika MPO", "Birmingham MPO (RPCGB)", "Calhoun Area Metropolitan Planning Organization", "Decatur Area MPO", "Eastern Shore MPO", "Gadsden-Etowah MPO", "Huntsville MPO (HATS)", "Mobile Area Transportation Study (MATS)", "Montgomery MPO", "Shoals Area MPO", "Southeast Wiregrass Area MPO", "Tuscaloosa Area MPO"],
        "AR": ["Central Arkansas Regional Transportation Study", "Frontier MPO", "Northeast Arkansas Regional Transportation Planning Commission", "Northwest Arkansas Regional Planning Commission (NWARPC)", "Pine Bluff Area Transportation Study (PBATS)", "Tri-Lakes MPO (HSA-MPO)", "West Memphis-Marion Area Transportation Study (WMATS)"],
        "AZ": ["Central Yavapai MPO (CYMPO)", "Lake Havasu Metropolitan Planning Organization (LHMPO)", "Maricopa Association of Governments (MAG)", "MetroPlan", "Pima Association of Governments (PAG)", "Sierra Vista Metropolitan Planning Organization (SVMPO)", "Sun Corridor Metropolitan Planning Organization", "Yuma MPO (YMPO)"],
        "CA": ["Association of Monterey Bay Area Governments (AMBAG)", "Butte County Association of Governments (BCAG)", "Fresno Council of Governments (Fresno COG)", "Kern COG", "Kings County Association of Governments (KCAG)", "Madera County Transportation Commission (Madera CTC)", "Merced County Association of Governments (MCAG)", "Metropolitan Transportation Commission (MTC)", "Sacramento Area COG (SACOG)", "San Diego Association of Governments (SANDAG)", "San Joaquin COG (SJCOG)", "San Luis Obispo COG (SLOCOG)", "Santa Barbara County Association of Governments (SBCAG)", "Shasta Regional Transportation Agency (SRTA)", "Southern California Association of Governments (SCAG)", "Stanislaus COG (StanCOG)", "Tulare County Association of Governments (TCAG)"],
        "CO": ["Denver Regional COG (DRCOG)", "Grand Junction / Mesa County MPO", "North Front Range MPO (NFRMPO)", "Pikes Peak Area COG (PPACG)", "Pueblo Area COG MPO and TPR (PACOG)"],
        "CT": ["Capital Region COG (CRCOG)", "CCOGon County ut River Valley MPO", "Greater Bridgeport / Valley MPO", "Housatonic Valley MPO", "Naugatuck Valley Council of Governments", "South Central Regional COG (SCRCOG)", "South Western MPO", "Southeastern Connecticut COG (SCCOG)"],
        "DC": ["National Capital Region Transportation Planning Board (TPB)"],
        "DE": ["Dover / Kent County MPO (D/KC MPO)", "Wilmington Area Planning Council (WILMAPCO)"],
        "FL": ["Bay County Transportation Planning Organization", "Broward MPO (BMPO)", "Capital Region Transportation Planning Agency (CRTPA)", "Charlotte-Punta Gorda MPO", "Collier MPO", "Florida-Alabama Transportation Planning Organization", "Gainesville MTPO (MTPO)", "Heartland Regional TPO", "Hernando/Citrus County MPO", "Hillsborough MPO (MPO)", "Indian River County MPO (IRCMPO)", "Lake-Sumter MPO", "Lee County MPO", "Martin MPO", "METROPLAN Orlando", "Miami-Dade MPO", "North Florida Transportation Planning Organization", "Ocala - Marion County Transportation Planning Organization", "Okaloosa-Walton Transportation Planning Organization (OWTPO)", "Palm Beach MPO", "Pasco County MPO", "Pinellas County MPO", "Polk County Transportation Planning Organization (TPO)", "River to Sea Transportation Planning Organization", "Sarasota-Manatee MPO", "Space Coast Transportation Planning Organization", "St. Lucie Transportation Planning Organization (St. Lucie TPO)"],
        "GA": ["Atlanta Regional Commission (ARC)", "Augusta Regional Transportation Study (ARTS)", "Brunswick Area Transportation Study (BATS)", "Cartersville-Bartow Metropolitan Planning Organization (CB-MPO)", "Columbus-Phenix City Metropolitan Planning Organization (C-PCMPO)", "Dougherty Area Regional Transportation Study (DARTS)", "Gainesville-Hall MPO (GHMPO)", "Greater Dalton MPO", "Hinesville Area MPO (HAMPO)", "Macon Area Transportation Study (MATS)", "Madison Athens-Clarke Oconee Regional Transportation Study (MACORTS)", "Rome-Floyd County Metropolitan Planning Organization (FRUTS)", "Savannah Coastal Region MPO", "Valdosta-Lowndes MPO (VLMPO)", "Warner Robins Area Transportation Study (WRATS)"],
        "HI": ["Maui MPO", "Oahu MPO"],
        "IA": ["Ames Area MPO (AAMPO)", "Bi-State Regional Commission", "Black Hawk Metropolitan Area Transportation Policy Board", "Corridor Metropolitan Planning Organization", "Des Moines Area MPO (DMAMPO)", "East Central Intergovernmental Association (ECIA)", "Metropolitan Planning Organization of Johnson County (MPOJC)", "Sioux City MPO"],
        "ID": ["Bannock Transportation Planning Organization (BTPO)", "Bonneville MPO (BMPO)", "Community Planning Association of Southwest Idaho (COMPASS)", "Kootenai MPO (KMPO)", "Lewis-Clark Valley MPO (LCVMPO)"],
        "IL": ["Champaign County Regional Planning Commission (CCRPC)", "Chicago Metropolitan Agency for Planning (CMAP)", "Danville Area Transportation Study (DATS)", "Decatur Urbanized Area Transportation Study (DUATS)", "DeKalb Sycamore Area Transportation Study (DSATS)", "Kankakee County Regional Planning Commission (KCRPC)", "McLean County Regional Planning Commission (MCRPC)", "Region One Planning Council (R1PC) (RMAP)", "Southern Illinois Metropolitan Planning Organization (SIMPO)", "Springfield Area Transportation Study (SATS)", "Tri-County Regional Planning Commission (TCRPC)"],
        "IN": ["Area Plan Commission of Tippecanoe County (APC)", "Bloomington/Monroe County Metropolitan Planning Organization (BMCMPO)", "Columbus Area MPO (CAMPO)", "Delaware-Muncie Metropolitan Plan Commission (DMMPC)", "Evansville MPO (EMPO)", "Indianapolis MPO", "Kokomo & Howard County Governmental Coordinating Council (KHCGCC)", "Madison County COG (MCCOG)", "Michiana Area COG (MACOG)", "Northeastern Indiana Regional Coordinating Council (NIRCC)", "Northwest Indiana Regional Planning Commission (NIRPC)", "Terre Haute Area (THAMPO)"],
        "KS": ["Flint Hills Metropolitan Planning Organization (FHMPO)", "Lawrence-Douglas County Metropolitan Planning Office (LDCMPO)", "Metropolitan Topeka Planning Organization", "Wichita Area MPO (WAMPO)"],
        "KY": ["Bowling Green-Warren County MPO", "Lexington Area MPO", "Louisville/Jefferson County KY-IN MPO", "Owensboro-Daviess County MPO", "Radcliff-Elizabethtown MPO"],
        "LA": ["Alexandria-Pineville MPO", "Capital Regional Planning Commission (CRPC)", "Houma-Thibodaux MPO (HT-MPO)", "Imperial Calcasieu Regional Planning & Development Commission (IMCAL)", "Lafayette Area MPO", "Northwest Louisiana COG (NLCOG)", "Ouachata Council of Governments (OCOG)", "Regional Planning Commission (RPC)"],
        "MA": ["Berkshire MPO", "Boston Region MPO", "Cape Cod MPO", "Central Massachusetts MPO", "Merrimack Valley MPO (MVMPO)", "Montachusett MPO (MMPO)", "Northern Middlesex MPO (NMMPO)", "Old Colony MPO", "Pioneer Valley MPO (PVMPO)", "Southeastern Massachusetts MPO"],
        "MD": ["Baltimore Regional Transportation Board (BRTB)", "Calvert-St. Mary’s Metropolitan Planning Organization (C-SMMPO)", "Cumberland Area MPO (CAMPO)", "Hagerstown-Eastern Panhandle MPO (HEPMPO)", "Salisbury-Wicomico MPO"],
        "ME": ["Androscoggin Transportation Resource Center (ATRC)", "Bangor Area Comprehensive Transportation System (BACTS)", "Kittery Area Comprehensive Transportation System (KACTS)", "Portland Area Comprehensive Transportation System (PACTS)"],
        "MI": ["Battle Creek Area Transportation Study (BCATS)", "Bay City Area Transportation Study (BCATS)", "Genesee County Metropolitan Planning Commission (GCMPC)", "Grand Valley Metropolitan Council (GVMC)", "Kalamazoo Area Transportation Study (KATS)", "Macatawa Area Coordinating Council (MACC)", "Midland Area Transportation Study", "Region 2 Planning Commission (R2PC)", "Saginaw Metropolitan Area Transportation Study (SMATS)", "Southeast Michigan COG (SEMCOG)", "Southwest Michigan Planning Commission (SWMPC)", "Traverse Transportation Coordinating Initiative (TTCI)", "Tri-County Regional Planning Commission (TCRPC)", "West Michigan Shoreline Regional Development Commission (WMSRDC)"],
        "MN": ["Duluth-Superior Metropolitan Interstate Council (MIC)", "Mankato / North Mankato Area Planning Organization", "Metropolitan Council", "Rochester-Olmsted COG (ROCOG)", "St. Cloud Area Planning Organization (APO)"],
        "MO": ["Capital Area MPO (CAMPO)", "Columbia Area Transportation Study Organization (CATSO)", "East-West Gateway Council of Government (EWGCOG)", "Joplin Area Transportation Study Organization (JATSO)", "Mid-America Regional Council (MARC)", "Ozarks Transportation Organization (OTO)", "Southeast Metropolitan Planning Organization (SEMPO)", "St. Joseph Area Transportation Study Organization (SJATSO)"],
        "MS": ["Central Mississippi Planning & Development District (CMPPD)", "Gulf Regional Planning Commission (GRPC)", "Hattiesburg-Petal-Forrest-Lamar MPO (HPFLMPO)"],
        "MT": ["Great Falls Planning and Community Development Department", "Missoula Metropolitan Planning Organization (Missoula MPO)", "Yellowstone County Planning Board"],
        "NC": ["Burlington-Graham MPO (BGMPO)", "Cabarrus-Rowan MPO", "Capital Area MPO (CAMPO)", "Charlotte Regional Transportation Planning Organization (CRTPO)", "Durham-Chapel Hill-Carrboro MPO (DCHCMPO)", "Fayetteville Area MPO (FAMPO)", "French Broad River MPO (FBRMPO)", "Gaston Cleveland Lincoln MPO", "Goldsboro Urban Area MPO", "Greater Hickory MPO", "Greensboro Urban Area MPO (GUAMPO)", "Greenville Urban Area MPO", "High Point Urban Area MPO (HPMPO)", "Jacksonville Urban Area MPO", "New Bern Area MPO", "Rocky Mount Urban Area MPO", "Wilmington Urban Area MPO (WMPO)", "Winston-Salem Urban Area MPO"],
        "ND": ["Bismarck-Mandan MPO (BIS-MAN)", "Fargo-Moorhead Metropolitan COG (FMMetroCOG)", "Grand Forks-East Grand Forks MPO"],
        "NE": ["Grand Island Area Metropolitan Planning Organization (GIAMPO)", "Lincoln Area MPO", "Metropolitan Area Planning Agency (MAPA)"],
        "NH": ["Nashua Regional Planning Commission (NRPC)", "Rockingham Planning Commission (RPC)", "Southern New Hampshire Planning Commission (SNHPC)", "Strafford Regional Planning Commission (SRPC)"],
        "NJ": ["North Jersey Transportation Planning Authority (NJTPA)", "South Jersey Transportation Planning Organization (SJTPO)"],
        "NM": ["Farmington MPO", "Las Cruces MPO", "Mid-Region COG (MRCOG)", "Santa Fe MPO (SFMPO)"],
        "NV": ["Carson Area Metropolitan Planning Organization (CAMPO)", "Regional Transportation Commission of Southern Nevada (RTC)", "Regional Transportation Commission of Washoe County (RTC)", "Tahoe MPO (TMPO)"],
        "NY": ["Adirondack/Glens Falls Transportation Council (A/GFTC)", "Binghamton Metropolitan Transportation Study (BMTS)", "Capital District Transportation Committee (CDTC)", "Dutchess County Transportation Council (DCTC)", "Elmira-Chemung Transportation Council (ECTC)", "Genesee Transportation Council (GTC)", "Greater Buffalo-Niagara Regional Transportation Council (GBNRTC)", "Herkimer-Oneida Counties Transportation Study (HOCTS)", "Ithaca-Tompkins County Transportation Council (ITCTC)", "New York Metropolitan Transportation Council (NYMTC)", "Orange County Transportation Council (OCTC)", "Syracuse Metropolitan Transportation Council (SMTC)", "Ulster County Transportation Council (UCTC)", "Watertown-Jefferson County Transportation Council (WJCTC)"],
        "OH": ["Akron Metropolitan Area Transportation Study (AMATS)", "Brook-Hancock-Jefferson Metropolitan Planning Commission (BHJMPC)", "Clark County-Springfield Transportation Study", "Eastgate Regional COG (EASTGATE)", "Licking County Area Transportation Study (LCATS)", "Lima-Allen County Regional Planning Commission (LACRPC)", "Miami Valley Regional Planning Commission (MVRPC)", "Mid-Ohio Regional Planning Commission (MORPC)", "Northeast Ohio Areawide Coordinating Agency (NOACA)", "Ohio-Kentucky-Indiana Regional Council of Governments", "Policy Committee of the Erie Regional Planning Commission (ERPC)", "Richland County Regional Planning Commission (RCRPC)", "Stark County Area Transportation Study (SCATS)", "Toledo Metropolitan Area COG (TMACOG)"],
        "OK": ["Association of Central Oklahoma Governments (ACOG)", "Indian Nations COG (INCOG)", "Lawton MPO"],
        "OR": ["Albany Area Metropolitan Planning Organization (AAMPO)", "Bend MPO (BMPO)", "Central Lane MPO (CLMPO/LCOG)", "Corvallis Area MPO (CAMPO)", "Middle Rogue MPO (MRMPO)", "Portland Area Comprehensive Transportation System (METRO)", "Rogue Valley MPO (RVMPO)", "Salem-Keizer Area Transportation Study (SKATS)"],
        "PA": ["Adams County Transportation Planning Organization (ACTPO)", "Blair County Planning Commission", "Cambria County MPO", "Centre County MPO (CCMPO)", "Delaware Valley Regional Planning Commission (DVRPC)", "Erie MPO", "Franklin County MPO (FCMPO)", "Harrisburg Area Transportation Study (HATS)", "Lackawanna-Luzerne Transportation Study", "Lancaster County MPO", "Lebanon County MPO (LEBCO MPO)", "Lehigh Valley Transportation Study (LVTS)", "Northeastern Pennsylvania Planning Alliance MPO", "Reading Area Transportation Study (RATS)", "Shenango Valley Area Transportation Study (SVATS)", "Southwestern Pennsylvania Commission (SPC)", "Susquehanna Economic Development Association Council of Governments (SEDA-COG MPO)", "Williamsport Area Transportation Study (WATS)", "York Area MPO (YAMPO)"],
        "PR": ["Puerto Rico Metropolitan Planning Organization"],
        "RI": ["State Planning Council (SPC)"],
        "SC": ["Anderson Area Transportation Study (ANATS)", "Charleston Area Transportation Study (CHATS)", "Columbia Area Transportation Study (COATS)", "Florence Area Transportation Study (FLATS)", "Grand-Strand Area Transportation Study (GSTAT)", "Greenville-Pickens Area Transportation Study (GPATS)", "Lowcountry Area Transportation Study (LATS)", "Rock Hill-Fort Mill Area Transportation Study (RFATS)", "Spartanburg Area Transportation Study (SPATS)", "Sumter Urban Area Transportation Study (SUATS)"],
        "SD": ["Rapid City Area MPO", "Sioux Falls MPO (SECOG)"],
        "TN": ["Bristol MPO", "Chattanooga-Hamilton County/North Georgia Transportation Planning Organization (CHCNGTPO)", "Clarksville Urbanized Area MPO (CUAMPO)", "Cleveland Area MPO", "Jackson Urban Area MPO", "Johnson City Metropolitan Transportation Planning Organization (MTPO)", "Kingsport MTPO", "Knoxville Regional Transportation Planning Organization", "Lakeway MPO (LAMTPO)", "Memphis Urban Area MPO", "Nashville Area MPO"],
        "TX": ["Abilene MPO", "Alamo Area MPO", "Amarillo MPO", "Bryan-College Station MPO (BCSMPO)", "Capital Area MPO (CAMPO)", "Corpus Christi MPO", "El Paso MPO", "Grayson County MPO", "Houston-Galveston Area Council (H-GAC)", "Killeen-Temple Metropolitan Planning Organization (KTMPO)", "Laredo & Webb County Area MPO (LUTS)", "Longview MPO", "Lubbock MPO (LMPO)", "North Central Texas COG (NCTCOG)", "Permian Basin MPO", "Rio Grande Valley MPO", "San Angelo MPO (SAMPO)", "South East Texas Regional Planning Commission (SETRPC)", "Texarkana MPO", "Tyler Area MPO", "Victoria MPO", "Waco MPO", "Wichita Falls MPO"],
        "UT": ["Cache MPO (CMPO)", "Dixie MPO (DMPO)", "Mountainland Association of Governments (MAG)", "Wasatch Front Regional Council (WFRC)"],
        "VA": ["Central Virginia Transportation Planning Organization (CVTPO)", "Charlottesville-Albemarle MPO", "Danville MPO", "Fredericksburg Area MPO (FAMPO)", "Hampton Roads Transportation Planning Organization (HRTPO)", "Harrisonburg-Rockingham MPO (HRMPO)", "New River Valley MPO", "Richmond Area MPO", "Roanoke Valley MPO", "Staunton-Augusta-Waynesboro MPO (SAWMPO)", "Tri Cities Area MPO", "Winchester-Frederick County MPO (WinFredMPO)"],
        "VT": ["Chittenden County RPC"],
        "WA": ["Benton-Franklin Council of Governments (BFCG)", "Chelan-Douglas Transportation Council (CDTC) (WVTC)", "Cowlitz-Wahkiakum Council of Governments", "Puget Sound Regional Council (PSRC)", "Skagit MPO (SMPO)", "Southwest Washington Regional Transportation Council (RTC)", "Spokane Regional Transportation Council (SRTC)", "Thurston Regional Planning Council (TRPC)", "Walla Walla Valley MPO (WWVMPO)", "Whatcom COG (WCOG)", "Yakima Valley MPO (YVMPO)"],
        "WI": ["Appleton/Fox Cities MPO", "Chippewa-Eau Claire MPO", "Fond du Lac Area MPO", "Green Bay MPO", "Janesville Area MPO", "La Crosse Area Planning Committee (LAPC)", "Madison Area Transportation Planning Board", "Oshkosh MPO", "Sheboygan MPO", "Southeastern Wisconsin Regional Planning Commission (SEWRPC)", "State Line Area Transportation Study (SLATS)", "Wausau Metropolitan Planning Organization"],
        "WV": ["BCKP Regional Intergovernmental Council (RIC)", "Belmont-Ohio-Marshall Transportation Study (BOMTS)", "Fayette/Raleigh MPO (FRMPO) (FRMPO)", "KYOVA Interstate Planning Commission (KYOVA)", "Morgantown Monongalia MPO (MMCTPO)", "Wood-Washington-Wirt Interstate Planning Commission (WWW)"],
        "WY": ["Casper Area MPO", "Cheyenne MPO (ChATPP)"]
    };  
    return mposByState[state] || [];
}

// Appends data visualization SVG
function showDataVisualization(scores) {
    const totalScore = Object.values(scores).reduce((acc, ele) => acc + ele);
    const scoreByElement = {};

    for (let [key, val] of Object.entries(scores)) {
        const modifiedKey = "E" + key.slice(1, -1).replace("-", " ");
        scoreByElement[modifiedKey] = (scoreByElement[modifiedKey] || 0) + val;
    }

    document.getElementById("your-score-details").lastElementChild.innerHTML = totalScore;
    document.getElementById("your-score-details").style.marginLeft = `${Math.floor(Math.min(totalScore, 100) / 100 * 1018)}px`;
    document.getElementById("your-score-svg").style.marginLeft = `${Math.floor(Math.min(totalScore, 100) / 100 * 1018)}px`;
    const width = 1038;
    const height = 150;

    const svg = d3.select("#score-comparison")
                .append("svg")
                .attr("width", width)
                .attr("height", height);
    const scale = d3.scaleLinear().domain([0, 100]).range([0, width - 20])
    const xAxis = d3.axisBottom().scale(scale);

    svg.append("g")
        .call(xAxis)
        .attr("transform", "translate(10, 130)");

    const data = [
        {element: "Element 1", value: scoreByElement["Element 1"]},
        {element: "Element 2", value: scoreByElement["Element 2"]},
        {element: "Element 3", value: scoreByElement["Element 3"]},
        {element: "Element 4", value: scoreByElement["Element 4"]},
        {element: "Element 5", value: scoreByElement["Element 5"]},
        {element: "Element 6", value: scoreByElement["Element 6"]},
        {element: "Element 7", value: scoreByElement["Element 7"]},
        {element: "Element 8", value: scoreByElement["Element 8"]},
        {element: "Element 9", value: scoreByElement["Element 9"]},
        {element: "Element 10", value: scoreByElement["Element 10"]},        
    ]
    
    const data2 = [
        {element: "Element 1", value: 12},
        {element: "Element 2", value: 9},
        {element: "Element 3", value: 10},
        {element: "Element 4", value: 8},
        {element: "Element 5", value: 8},
        {element: "Element 6", value: 7},
        {element: "Element 7", value: 10},
        {element: "Element 8", value: 13},
        {element: "Element 9", value: 8},
        {element: "Element 10", value: 15},        
    ]

    const width2 = 1045;
    const height2 = 378;

    const svg2 = d3.select("#score-data-visualization")
                .append("svg")
                .attr("width", width2)
                .attr("height", height2 + 55);

    const x = d3.scaleBand()
            .domain(data.map(d => d.element))
            .range([0, width2 - 30])
            .padding(0.5);

    const y = d3.scaleLinear()
            .domain([0, 14])
            .range([height2 - 30, 0]);

    svg2.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(12).tickValues([0, 2, 4, 6, 8, 10, 12, 14]))
        .attr("transform", "translate(30, 10)");

    svg2.append("g")
        .call(d3.axisBottom(x).tickSize(0).tickPadding(12))
        .attr("transform", "translate(30, 358)");

    svg2.selectAll("mybar")
    .data(data2)
    .enter()
    .append("rect")
        .attr("x", function(d) { return x(d.element) + 30; })
        .attr("y", function(d) { return y(d.value) + 10; })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height2 - 30 - y(d.value); })
        .attr("fill", "#D9D9D9");
    
    svg2.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
        .attr("x", function(d) { return x(d.element) + 30; })
        .attr("y", function(d) { return y(d.value || 0) + 10; })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height2 - 30 - y(d.value || 0); })
        .attr("fill", "#0082C8");
    
    svg2.append("rect").attr("x", 750).attr("y", 400).attr("width", 32).attr("height", 18).style("fill", "#0082C8")
    svg2.append("rect").attr("x", 880).attr("y", 400).attr("width", 32).attr("height", 18).style("fill", "#D9D9D9")
    svg2.append("text").attr("x", 790).attr("y", 410).text("Your Score").style("font-size", "15px").style("color", "#282828").attr("alignment-baseline","middle")
    svg2.append("text").attr("x", 920).attr("y", 410).text("Element Score").style("font-size", "15px").style("color", "#282828").attr("alignment-baseline","middle")
}

// Appends data visualization for mobile users
function showDataVisualizationMobile(scores) {
    const totalScore = Object.values(scores).reduce((acc, ele) => acc + ele);
    const scoreByElement = {};

    for (let [key, val] of Object.entries(scores)) {
        const parentId = document.getElementById(key).parentElement.id;
        scoreByElement[parentId] = (scoreByElement[parentId] || 0) + val;
    }

    const maxScoreByElement = {
        "element-one": 12,
        "element-two": 9,
        "element-three": 10,
        "element-four": 8,
        "element-five": 8,
        "element-six": 7,
        "element-seven": 10,
        "element-eight": 13,
        "element-nine": 8,
        "element-ten": 15,        
    }

    const element1 = document.getElementById("element-one").cloneNode(true);
    const element2 = document.getElementById("element-two").cloneNode(true);
    const element3 = document.getElementById("element-three").cloneNode(true);
    const element4 = document.getElementById("element-four").cloneNode(true);
    const element5 = document.getElementById("element-five").cloneNode(true);
    const element6 = document.getElementById("element-six").cloneNode(true);
    const element7 = document.getElementById("element-seven").cloneNode(true);
    const element8 = document.getElementById("element-eight").cloneNode(true);
    const element9 = document.getElementById("element-nine").cloneNode(true);
    const element10 = document.getElementById("element-ten").cloneNode(true);
    const elements = [element1, element2, element3, element4, element5, element6, element7, element8, element9, element10];
    const div = document.getElementById("score-data-visualization-mobile");
//     <div id="score-tracker-bar-empty">
//     <div id="score-tracker-bar-fill" style="width:75%"></div>
//   </div>
    const elementName = document.createElement('div');
    elementName.style.fontSize = "16px";
    elementName.style.color = "#282828";
    elementName.style.fontWeight = "bold";
    elementName.style.marginRight = "24px";

    const emptyDiv = document.createElement('div');
    const filledDiv = document.createElement('div');
    emptyDiv.style.width = "226px";
    emptyDiv.style.height = "24px";
    emptyDiv.style.backgroundColor = "#EBEBEB";
    emptyDiv.style.borderRadius = "12px";
    filledDiv.style.height = "24px";
    filledDiv.style.backgroundColor = "#0082C8";
    filledDiv.style.borderRadius = "12px";

    emptyDiv.appendChild(filledDiv);

    const elementScore = document.createElement('div');
    elementScore.style.marginLeft = "12px";
    elementName.style.fontSize = "16px";
    elementName.style.color = "#282828";
    
    for (let i = 0; i < elements.length; i++) {
        const row = document.createElement('div');
        row.style.marginBottom = "18px";
        row.style.display = "flex";
        row.appendChild(elementName.cloneNode(true));
        row.appendChild(emptyDiv.cloneNode(true));
        row.appendChild(elementScore.cloneNode(true));
        row.children[0].innerHTML = `Element ${i + 1}`;
        row.children[1].firstElementChild.style.width = `${Math.floor((scoreByElement[elements[i].id] || 0) / maxScoreByElement[elements[i].id] * 100)}%`;
        row.children[2].innerHTML = `${Math.floor((scoreByElement[elements[i].id] || 0) / maxScoreByElement[elements[i].id] * 100)}%`;
        div.appendChild(row);
    }
}

// Saves PDF to user's local drive
async function saveImage(scores) {
    const scoreByElement = {};

    for (let [key, val] of Object.entries(scores)) {
        const parentId = document.getElementById(key).parentElement.id;
        scoreByElement[parentId] = (scoreByElement[parentId] || 0) + val;
    }

    const maxScoreByElement = {
        "element-one": 12,
        "element-two": 9,
        "element-three": 10,
        "element-four": 8,
        "element-five": 8,
        "element-six": 7,
        "element-seven": 10,
        "element-eight": 13,
        "element-nine": 8,
        "element-ten": 15,        
    }

    const mapping = {
        "element-one": "Element 1: Establishes commitment and vision",
        "element-two": "Element 2: Prioritizes underinvested and underserved communities",
        "element-three": "Element 3: Applies to all projects and phases",
        "element-four": "Element 4: Allows only clear exceptions",
        "element-five": "Element 5: Mandates coordination",
        "element-six": "Element 6: Adopts excellent design guidance",
        "element-seven": "Element 7: Requires proactive land-use planning",
        "element-eight": "Element 8: Measures progress",
        "element-nine": "Element 9: Sets criteria for choosing projects",
        "element-ten": "Element 10: Creates a plan for implementation",
    }
    
    const logo = document.createElement('img');
    logo.src = "https://ticket-tracker-bucket.s3.us-west-1.amazonaws.com/logo.png"
    
    const address = document.createElement('div');
    const addressLine1 = document.createElement('div');
    const addressLine2 = document.createElement('div');
    const addressLine3 = document.createElement('div');
    addressLine1.innerHTML = "1152 15TH ST NW SUITE 450"
    addressLine2.innerHTML = "WASHINGTON, DC 20005"
    addressLine3.innerHTML = "(202) 207-3355"
    
    address.appendChild(addressLine1);
    address.appendChild(addressLine2);
    address.appendChild(addressLine3);
    address.style.marginRight = "48px";

    // Create div to hold logo and address
    const headerDiv1 = document.createElement('div');
    headerDiv1.style.display = "flex";
    headerDiv1.style.justifyContent = "space-between";
    headerDiv1.style.alignItems = "center";
    headerDiv1.style.height = "80px";
    headerDiv1.style.marginBottom = "24px";
    headerDiv1.style.borderTop = "1px solid black";
    headerDiv1.style.borderBottom = "1px solid black";
    headerDiv1.appendChild(logo);
    headerDiv1.appendChild(address);

    // Create div to hold score details
    const headerDiv2 = document.createElement('div');
    headerDiv2.style.display = "flex";
    headerDiv2.style.alignItems = "center";
    headerDiv2.style.paddingLeft = "12px";
    headerDiv2.style.height = "27px";
    headerDiv2.style.marginBottom = "24px";
    headerDiv2.innerHTML = "Score Details";
    headerDiv2.style.backgroundColor = "#E8F7FF";
    headerDiv2.style.color = "#0082C8";
    headerDiv2.style.fontSize = "16pt";
    headerDiv2.style.fontWeight = "bold";

    // Create header 
    const header = document.createElement('div');
    header.style.margin = "48px 72px 0px 72px";
    header.appendChild(headerDiv1);
    header.appendChild(headerDiv2);

    // Create footer
    const footerDiv1 = document.createElement('div');
    const footerDiv2 = document.createElement('div');
    footerDiv1.innerHTML = "Complete Streets Policy Evaluation Report";

    const footer = document.createElement('div');
    footer.style.margin = "auto 72px 24px 72px";
    footer.style.borderTop = "1px solid #595959";
    footer.style.display = "flex";
    footer.style.color = "#595959";
    footer.style.fontSize = "12px";
    footer.style.paddingTop = "8px";
    footer.style.justifyContent = "space-between";
    footer.appendChild(footerDiv1);
    footer.appendChild(footerDiv2);

    // Identify elements to be included in the PDF
    const svg1 = document.querySelector("#score-comparison").cloneNode(true);
    const svg2 = document.querySelector("#score-data-visualization").cloneNode(true);
    const element1 = document.getElementById("element-one").cloneNode(true);
    const element2 = document.getElementById("element-two").cloneNode(true);
    const element3 = document.getElementById("element-three").cloneNode(true);
    const element4 = document.getElementById("element-four").cloneNode(true);
    const element5 = document.getElementById("element-five").cloneNode(true);
    const element6 = document.getElementById("element-six").cloneNode(true);
    const element7 = document.getElementById("element-seven").cloneNode(true);
    const element8 = document.getElementById("element-eight").cloneNode(true);
    const element9 = document.getElementById("element-nine").cloneNode(true);
    const element10 = document.getElementById("element-ten").cloneNode(true);

    // Make elements visible and update margin
    svg1.style.display = "block";
    svg2.style.display = "block";
    element1.style.display = "block";
    element2.style.display = "block";
    element3.style.display = "block";
    element4.style.display = "block";
    element5.style.display = "block";
    element6.style.display = "block";
    element7.style.display = "block";
    element8.style.display = "block";
    element9.style.display = "block";
    element10.style.display = "block";
    element1.firstElementChild.style.marginTop = "24px";
    element2.firstElementChild.style.marginTop = "24px";
    element3.firstElementChild.style.marginTop = "24px";
    element4.firstElementChild.style.marginTop = "24px";
    element5.firstElementChild.style.marginTop = "24px";
    element6.firstElementChild.style.marginTop = "24px";
    element7.firstElementChild.style.marginTop = "24px";
    element8.firstElementChild.style.marginTop = "24px";
    element9.firstElementChild.style.marginTop = "24px";
    element10.firstElementChild.style.marginTop = "24px";

    // Track current element name
    const elementName = document.createElement('div');
    elementName.style.color = "#0082C8";
    elementName.style.fontSize = "14pt";
    elementName.style.fontWeight = "bold";
    elementName.style.margin = "0px 72px";

    // Create container div to hold all content
    const div = document.createElement("div");
    div.style.position = "relative";
    div.style.display = "flex";
    div.style.height = "1575px";
    div.style.width = "1050px";
    div.style.flexDirection = "column";
    div.appendChild(header);
    div.appendChild(elementName)
    div.appendChild(element1);
    div.appendChild(footer);

    
    // Define jsPDF
    const jspdf = window.jsPDF;
    const doc = new jspdf('p', 'px', [600, 900]);
    const pages = [element1, element2, element3, element4, element5, element6, element7, element8, element9, element10];
    let currentPage = 1;

    for (let page of pages) {
        const cloneNode = div.cloneNode(true);
        const [cloneHeader, cloneElementName, cloneElement, cloneFooter] = cloneNode.children;
        
        const newElement = page.cloneNode(true)
        cloneNode.replaceChild(newElement, cloneElement);
        
        const score = ` (${scoreByElement[cloneElement.id] || 0} / ${maxScoreByElement[cloneElement.id]})`;
        cloneElementName.innerHTML = mapping[newElement.id] + score;
        cloneFooter.lastElementChild.innerHTML = currentPage;

        document.getElementById('submission-page').appendChild(cloneNode);

        const canvas = await html2canvas(cloneNode, { logging: false, dpi: 300, letterRendering: true });
        const imgData = canvas.toDataURL("image/jpeg", 1.0)
        doc.addImage(imgData, 'PNG', 0, 0);
        if (page === element10) {
            doc.setProperties({ title: "Complete Streets Policy Evaluation Results" });
            doc.save();
        }
        else {
            doc.addPage();
        }

        currentPage++;
        document.getElementById('submission-page').removeChild(cloneNode);
    }
}

main();


