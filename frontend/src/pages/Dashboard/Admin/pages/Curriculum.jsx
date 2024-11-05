import React, { useState } from "react";
import Layout from "components/Layout/Layout";
import Loading from "components/Loading/Loading";
import { MessageWarning } from "components/ui/Message/MessageWarning";
import useFetchData from "hooks/useFetchData";

import styles from "./Curriculum.module.scss";
import {
   TbArrowNarrowLeft,
   TbCircleCheckFilled,
   TbEdit,
   TbPlus,
} from "react-icons/tb";
import CourseTable from "./components/CourseTable/CourseTable";
import CreateCurriculum from "./components/CreateCurriculum/CreateCurriculum";
import EditCurriculum from "./components/EditCurriculum/EditCurriculum";
import { useNavigate } from "react-router-dom";

const Curriculum = () => {
   const [currentStep, setCurrentStep] = useState(1);
   const [currentPage, setCurrentPage] = useState("base");
   const [selectedProgram, setSelectedProgram] = useState(null);
   const [programData, setProgramData] = useState(null);
   const [curriculumData, setCurriculumData] = useState(null);

   const navigate = useNavigate();
   const token = localStorage.getItem("token");
   const { data: programs, loading: loadingPrograms } = useFetchData(
      "program",
      token
   );
   const { data: curriculums, loading: loadingCurriculums } = useFetchData(
      "curriculum",
      token
   );
   const { data: courses, loading: loadingCourses } = useFetchData(
      "course",
      token
   );
   const { data: users, loading: loadingUsers } = useFetchData("user", token);

   const pageLabels = {
      create: "Create Curriculum",
      edit: "Edit Curriculum",
   };

   const handleSelectProgram = (program) => {
      if (selectedProgram === program) {
         setSelectedProgram(null);
         setProgramData(null);
         setCurriculumData(null);
      } else {
         setSelectedProgram(program);
         setProgramData(program);

         const curriculumData = curriculums.find(
            (curriculum) => curriculum.programId === program.programId
         );

         console.log(curriculumData);
         curriculumData === undefined
            ? setCurrentPage("create")
            : setCurrentPage("base");

         setCurriculumData(curriculumData);
      }
   };

   const handleNextStep = () => {
      console.log(currentPage);
      setCurrentStep((prevStep) => prevStep + 1);
   };
   const handlePreviousStep = () => {
      if (curriculumData !== undefined) setCurrentPage("base");

      if (currentStep <= 1) {
         navigate("/admin/dashboard/academic-planner");
         return;
      }

      if (currentPage === "base" || curriculumData === undefined) {
         setCurrentStep((prevStep) => prevStep - 1);
      }
   };

   const isLoading =
      loadingPrograms || loadingCurriculums || loadingUsers || loadingCourses;

   if (isLoading) return <Loading />;

   return (
      <Layout role="admin" pageName="Curriculum">
         <div className={styles.mainContent}>
            <section className={styles.wrapper}>
               {currentStep !== 3 && (
                  <p className={styles.iconLabel} onClick={handlePreviousStep}>
                     <TbArrowNarrowLeft size={24} />
                     Return to page
                  </p>
               )}
               {currentStep === 1 && (
                  <>
                     <div className={styles.selectProgram}>
                        <div className={styles.info}>
                           <div>
                              <h2 className={styles.title}>Choose a program</h2>
                              <p className={styles.desc}>
                                 Since curriculums are predefined to each
                                 program, you'll need to select a program to
                                 view/edit its curriculum.
                              </p>
                           </div>
                           {curriculumData === undefined && (
                              <MessageWarning
                                 title="This program does not have a curriculum!"
                                 message="Please create one for it immediately by proceeding to the next step."
                              />
                           )}
                        </div>
                        <div className={styles.programsList}>
                           {programs.map((program) => (
                              <div
                                 className={`${styles.programCard} ${
                                    selectedProgram?.collegeCode ===
                                    program?.collegeCode
                                       ? styles.active
                                       : ""
                                 }`}
                                 onClick={() => handleSelectProgram(program)}
                                 key={program.collegeCode}
                              >
                                 <h3>{program.programDescription}</h3>
                                 <p className={styles.badge}>
                                    {program.collegeCode}
                                 </p>
                              </div>
                           ))}
                        </div>
                     </div>
                     <button
                        type="button"
                        onClick={handleNextStep}
                        className={`${styles.primaryBtn} ${styles.ctaBtn}`}
                     >
                        Next step
                     </button>
                  </>
               )}
               {currentStep === 2 && (
                  <>
                     <div className={styles.programInfo}>
                        <h1>
                           {programData?.programDescription} (
                           {programData?.collegeCode})
                        </h1>
                        <div className={styles.breadcrumbContainer}>
                           <p>Overview</p>
                           {currentPage !== "base" && (
                              <>
                                 <p>/</p>
                                 <p>{pageLabels[currentPage]}</p>
                              </>
                           )}
                        </div>
                     </div>
                     {currentPage === "base" && (
                        <div className={styles.editWrapper}>
                           <div className={styles.buttonContainer}>
                              <button
                                 type="button"
                                 className={`${styles.iconBtn} ${styles.primaryBtn}`}
                                 onClick={() => setCurrentPage("create")}
                              >
                                 <TbPlus size={20} />
                                 Create curriculum
                              </button>
                              <button
                                 type="button"
                                 className={`${styles.iconBtn} ${styles.secondaryBtn}`}
                                 onClick={() => setCurrentPage("edit")}
                              >
                                 <TbEdit size={20} />
                                 Edit curriculum
                              </button>
                           </div>
                           <div>
                              <h2 className={styles.title}>Summary</h2>
                              <div className={styles.summaryContainer}>
                                 {Array.from(
                                    { length: programData.duration },
                                    (_, index) => (
                                       <div
                                          className={styles.curriculumCard}
                                          key={index}
                                       >
                                          <div className={styles.yearInfo}>
                                             <p className={styles.badge}>
                                                {
                                                   [
                                                      "First Year",
                                                      "Second Year",
                                                      "Third Year",
                                                      "Fourth Year",
                                                      "Fifth Year",
                                                   ][index]
                                                }
                                             </p>
                                             <p
                                                className={
                                                   styles.yearDescription
                                                }
                                             >
                                                {
                                                   [
                                                      "Introduction to foundational subjects and core principles.",
                                                      "Building on fundamentals with intermediate coursework.",
                                                      "Advanced topics and specialized courses.",
                                                      "Practical experience, research, and capstone projects.",
                                                      "Finalizing expertise and preparing for graduation.",
                                                   ][index]
                                                }
                                             </p>
                                          </div>
                                       </div>
                                    )
                                 )}
                              </div>
                           </div>
                           <div className={styles.editContainer}>
                              {[
                                 {
                                    title: "Core courses",
                                    desc: "These courses are mandatory and provide essential knowledge in the field.",
                                    courses: curriculumData.courses,
                                 },
                                 {
                                    title: "Elective courses",
                                    desc: "Elective courses allow students to explore additional areas of interest or specialization.",
                                    courses: curriculumData.electiveCourses,
                                 },
                              ].map((section, index) => (
                                 <div key={index}>
                                    <h2 className={styles.title}>
                                       {section.title}
                                    </h2>
                                    <p className={styles.desc}>
                                       {section.desc}
                                    </p>
                                    <br />
                                    <CourseTable courses={section.courses} />
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                     {currentPage === "create" && (
                        <CreateCurriculum
                           token={token}
                           users={users}
                           courses={courses}
                           selectedProgram={selectedProgram}
                           programData={programData}
                           handleNextStep={handleNextStep}
                           handlePreviousStep={handlePreviousStep}
                           currentPage={currentPage}
                           setCurrentPage={setCurrentPage}
                        />
                     )}
                     {currentPage === "edit" && (
                        <EditCurriculum
                           token={token}
                           users={users}
                           courses={courses}
                           selectedProgram={selectedProgram}
                           programData={programData}
                           handleNextStep={handleNextStep}
                           handlePreviousStep={handlePreviousStep}
                           currentPage={currentPage}
                           setCurrentPage={setCurrentPage}
                        />
                     )}
                  </>
               )}
               {currentStep === 3 && (
                  <>
                     <div className={styles.success}>
                        <div className={styles.content}>
                           <TbCircleCheckFilled color="green" size={100} />
                           <h2 className={styles.title}>
                              Curriculum created succesfully!
                           </h2>
                           <p className={styles.desc}>
                              You can head back now to the inital page and
                              choose another program to create/edit its
                              curriculum.
                           </p>
                        </div>
                        <a href="/admin/dashboard/academic-planner/curriculums">
                           <button type="button" className={styles.primaryBtn}>
                              Back to initial page
                           </button>
                        </a>
                     </div>
                  </>
               )}
            </section>
         </div>
      </Layout>
   );
};

export default Curriculum;
