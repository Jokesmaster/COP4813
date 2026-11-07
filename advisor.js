const courseContainer = document.getElementById("courseContainer");
const planContainer = document.getElementById("planContainer");

const completedCount = document.getElementById("completedCount");
const availableCount = document.getElementById("availableCount");
const plannedCount = document.getElementById("plannedCount");

const clearPlanButton = document.getElementById("clearPlanButton");
const advisorError = document.getElementById("advisorError");

let courses = [];
let completedCourses = new Set();
let plannedCourses = new Set();

fetch("courses.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Unable to load courses.json");
        }

        return response.json();
    })
    .then(function (data) {
        courses = data.courses;

        renderCourses();
        renderPlan();
    })
    .catch(function (error) {
        console.error(error);

        courseContainer.innerHTML = "";

        advisorError.textContent =
            "The course data could not be loaded.";
    });


function hasPrerequisites(course) {
    const prerequisites = course.prerequisites;

    const allRequirementsMet =
        prerequisites.all.every(function (courseCode) {
            return completedCourses.has(courseCode);
        });

    const anyRequirementsMet =
        prerequisites.any.every(function (group) {
            return group.some(function (courseCode) {
                return completedCourses.has(courseCode);
            });
        });

    return allRequirementsMet && anyRequirementsMet;
}


function getCourse(code) {
    return courses.find(function (course) {
        return course.code === code;
    });
}


function getPrerequisiteText(course) {
    const prerequisites = course.prerequisites;

    const parts = [];

    if (prerequisites.all.length > 0) {
        parts.push(prerequisites.all.join(" AND "));
    }

    prerequisites.any.forEach(function (group) {
        parts.push("(" + group.join(" OR ") + ")");
    });

    if (parts.length === 0) {
        return "No prerequisites";
    }

    return parts.join(" AND ");
}


function isChoiceDisabled(course) {
    if (!course.choiceGroup) {
        return false;
    }

    return courses.some(function (otherCourse) {
        return (
            otherCourse.choiceGroup === course.choiceGroup &&
            otherCourse.code !== course.code &&
            completedCourses.has(otherCourse.code)
        );
    });
}


function renderCourses() {
    courseContainer.innerHTML = "";

    let availableTotal = 0;

    courses.forEach(function (course) {
        const completed = completedCourses.has(course.code);
        const eligible = hasPrerequisites(course);
        const choiceDisabled = isChoiceDisabled(course);

        if (eligible && !completed && !choiceDisabled) {
            availableTotal++;
        }

        const card = document.createElement("article");

        card.classList.add("course-card");

        if (completed) {
            card.classList.add("course-completed");
        } else if (eligible && !choiceDisabled) {
            card.classList.add("course-available");
        } else {
            card.classList.add("course-locked");
        }

        const heading = document.createElement("h3");

        heading.textContent =
            course.code + " - " + course.name;

        card.appendChild(heading);


        const category = document.createElement("p");

        category.classList.add("course-category");

        category.textContent =
            course.category + " | " +
            course.credits + " Credits";

        card.appendChild(category);


        const prerequisiteText =
            document.createElement("p");

        prerequisiteText.innerHTML =
            "<strong>Prerequisites:</strong> " +
            getPrerequisiteText(course);

        card.appendChild(prerequisiteText);


        const status = document.createElement("p");

        status.classList.add("course-status");

        if (completed) {
            status.textContent = "Status: Completed";
        } else if (choiceDisabled) {
            status.textContent =
                "Status: Alternative requirement already completed";
        } else if (eligible) {
            status.textContent = "Status: Available";
        } else {
            status.textContent =
                "Status: Prerequisites Needed";
        }

        card.appendChild(status);


        const controls = document.createElement("div");

        controls.classList.add("course-controls");


        const completedLabel =
            document.createElement("label");

        completedLabel.classList.add(
            "completed-course-label"
        );


        const completedCheckbox =
            document.createElement("input");

        completedCheckbox.type = "checkbox";

        completedCheckbox.checked = completed;

        completedCheckbox.disabled =
            choiceDisabled && !completed;

        completedCheckbox.dataset.course =
            course.code;


        completedCheckbox.addEventListener(
            "change",
            function () {
                handleCompletedChange(
                    course,
                    completedCheckbox.checked
                );
            }
        );


        completedLabel.appendChild(
            completedCheckbox
        );

        completedLabel.appendChild(
            document.createTextNode(
                " I have completed this course"
            )
        );

        controls.appendChild(completedLabel);


        const infoButton =
            document.createElement("button");

        infoButton.type = "button";
        infoButton.classList.add("info-button");

        infoButton.textContent = "Course Info";


        const note = document.createElement("p");

        note.classList.add("course-note");
        note.hidden = true;

        note.textContent = course.note;


        infoButton.addEventListener(
            "click",
            function () {
                note.hidden = !note.hidden;

                if (note.hidden) {
                    infoButton.textContent =
                        "Course Info";
                } else {
                    infoButton.textContent =
                        "Hide Info";
                }
            }
        );

        controls.appendChild(infoButton);


        if (
            eligible &&
            !completed &&
            !choiceDisabled
        ) {
            const planButton =
                document.createElement("button");

            planButton.type = "button";
            planButton.classList.add(
                "plan-button"
            );

            if (plannedCourses.has(course.code)) {
                planButton.textContent =
                    "Remove from Plan";
            } else {
                planButton.textContent =
                    "Add to Plan";
            }


            planButton.addEventListener(
                "click",
                function () {
                    toggleCoursePlan(course.code);
                }
            );

            controls.appendChild(planButton);
        }


        card.appendChild(controls);

        card.appendChild(note);

        courseContainer.appendChild(card);
    });


    completedCount.textContent =
        completedCourses.size;

    availableCount.textContent =
        availableTotal;

    plannedCount.textContent =
        plannedCourses.size;
}


function handleCompletedChange(
    course,
    isCompleted
) {
    if (isCompleted) {
        completedCourses.add(course.code);

        plannedCourses.delete(course.code);
    } else {
        completedCourses.delete(course.code);
    }

    removeInvalidPlannedCourses();

    renderCourses();
    renderPlan();
}


function toggleCoursePlan(courseCode) {
    if (plannedCourses.has(courseCode)) {
        plannedCourses.delete(courseCode);
    } else {
        plannedCourses.add(courseCode);
    }

    renderCourses();
    renderPlan();
}


function removeInvalidPlannedCourses() {
    plannedCourses.forEach(function (courseCode) {
        const course = getCourse(courseCode);

        if (
            !course ||
            !hasPrerequisites(course) ||
            completedCourses.has(courseCode) ||
            isChoiceDisabled(course)
        ) {
            plannedCourses.delete(courseCode);
        }
    });
}


function renderPlan() {
    planContainer.innerHTML = "";

    if (plannedCourses.size === 0) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.textContent =
            "No courses have been added to your plan yet.";

        planContainer.appendChild(emptyMessage);

        plannedCount.textContent = "0";

        return;
    }


    const list = document.createElement("ul");

    list.classList.add("planned-course-list");


    plannedCourses.forEach(function (courseCode) {
        const course = getCourse(courseCode);

        if (!course) {
            return;
        }


        const item = document.createElement("li");

        const courseText =
            document.createElement("span");

        courseText.textContent =
            course.code +
            " - " +
            course.name;


        const removeButton =
            document.createElement("button");

        removeButton.type = "button";

        removeButton.textContent = "Remove";

        removeButton.addEventListener(
            "click",
            function () {
                plannedCourses.delete(
                    course.code
                );

                renderCourses();
                renderPlan();
            }
        );


        item.appendChild(courseText);

        item.appendChild(removeButton);

        list.appendChild(item);
    });


    planContainer.appendChild(list);

    plannedCount.textContent =
        plannedCourses.size;
}


clearPlanButton.addEventListener(
    "click",
    function () {
        plannedCourses.clear();

        renderCourses();
        renderPlan();
    }
);