import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "components/Layout/Layout";
import SearchBar from "components/SearchBar/SearchBar";
import Popup from "components/Popup/Popup";
import Checkbox from "components/ui/Checkbox/Checkbox";
import Loading from "components/Loading/Loading";
import { format } from "date-fns";
import styles from "./UserManagement.module.scss";
import userIcon from "assets/images/profile.jpg";
import {
   TbArrowLeft,
   TbArrowRight,
   TbDotsVertical,
   TbEdit,
   TbFileArrowRight,
   TbFilter,
   TbPlus,
   TbTrash,
} from "react-icons/tb";
import { usePopupAlert } from "hooks";
import useFetchData from "hooks/useFetchData";
import UserIcon from "components/ui/UserIcon/UserIcon";
import { formatDistanceToNow } from "date-fns";

const POPUP_ICON_SIZE = 25;
const MEDIUM_ICON_SIZE = 22;
const SMALL_ICON_SIZE = 19;

const UserManagement = () => {
   const [activePopup, setActivePopup] = useState(null);
   const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });
   const [isPopupVisible, setIsPopupVisible] = useState(false);
   const [selectedUsers, setSelectedUsers] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);

   const token = localStorage.getItem("token");
   const { data: users, loading, error } = useFetchData("user", token);
   const { showError } = usePopupAlert();

   const usersPerPage = 8;
   const totalPages = Math.ceil(users.length / usersPerPage);
   const indexOfLastUser = currentPage * usersPerPage;
   const indexOfFirstUser = indexOfLastUser - usersPerPage;
   const currentUsers = useMemo(() => {
      return users.slice(indexOfFirstUser, indexOfLastUser);
   }, [users, indexOfFirstUser, indexOfLastUser]);

   useEffect(() => {
      console.log(currentPage);
   });

   const handlePreviousPage = () => {
      if (currentPage !== 1) setCurrentPage(currentPage - 1);
   };

   const handleNextPage = () => {
      if (currentPage !== totalPages) setCurrentPage(currentPage + 1);
   };

   const togglePopupAction = (userId, event) => {
      const rect = event.currentTarget.getBoundingClientRect();

      setTimeout(() => {
         if (activePopup === userId) {
            closePopupAction();
         } else {
            setActivePopup(userId);
            setIsPopupVisible(true);
            setPopupPosition({ top: rect.bottom - 40, left: rect.left - 150 });
         }
      }, 100);
   };

   const closePopupAction = () => {
      setIsPopupVisible(false);
      setTimeout(() => {
         setActivePopup(null);
      }, 100);
   };

   const handleCheckboxChange = (userId) => {
      if (selectedUsers.includes(userId)) {
         setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      } else {
         setSelectedUsers([...selectedUsers, userId]);
      }
   };
   const handleSelectAll = () => {
      if (selectedUsers.length === currentUsers.length) {
         setSelectedUsers([]);
      } else {
         setSelectedUsers(currentUsers.map((user) => user.userId));
      }
   };

   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

   const formatDate = (isoString) => {
      return format(new Date(isoString), "MMMM d, yyyy");
   };

   if (error) showError("Oops! Something went wrong", error);

   return (
      <Layout role="admin" pageName="User Management">
         <main className={styles.mainContent}>
            <section className={styles.tableWrapper}>
               <div className={styles.tableContainer}>
                  <div className={styles.header}>
                     <h3 className={styles.label}>
                        All users <span>{users.length}</span>
                     </h3>
                     <div className={styles.tools}>
                        <SearchBar width="30rem" />
                        <button
                           type="button"
                           className={`${styles.secondaryBtn} ${styles.iconBtn}`}
                        >
                           <TbFilter size={SMALL_ICON_SIZE} />
                           Filters
                        </button>
                        <button
                           type="button"
                           className={`${styles.primaryBtn} ${styles.iconBtn}`}
                        >
                           <TbPlus size={SMALL_ICON_SIZE} />
                           Add user
                        </button>
                     </div>
                  </div>
                  <div className={styles.table}>
                     <div className={styles.tableHeader}>
                        <Checkbox
                           id="select-all"
                           isChecked={
                              selectedUsers.length === currentUsers.length
                           }
                           onChange={handleSelectAll}
                        />
                        <h4>Name</h4>
                        <h4>Role</h4>
                        <h4>Last Seen</h4>
                        <h4>Date added</h4>
                     </div>
                     {currentUsers.map((user, index) => (
                        <div key={user.userId}>
                           <div className={styles.tableItem}>
                              <Checkbox
                                 id={`checkbox-${user.userId}`}
                                 isChecked={selectedUsers.includes(user.userId)}
                                 onChange={() =>
                                    handleCheckboxChange(user.userId)
                                 }
                              />
                              <div className={styles.userContainer}>
                                 <UserIcon image={userIcon} size={48} />
                                 <div className={styles.userInfo}>
                                    <h4
                                       className={styles.title}
                                    >{`${user.firstName} ${user.lastName}`}</h4>
                                    <p className={styles.desc}>{user.email}</p>
                                 </div>
                              </div>
                              <p className={styles.role}>{user.role}</p>
                              <p className={styles.lastActive}>
                                 {formatDistanceToNow(
                                    new Date(user.lastActive),
                                    { addSuffix: true }
                                 )}
                              </p>
                              <p className={styles.createdAt}>
                                 {formatDate(user.createdAt)}
                              </p>
                              <button
                                 type="button"
                                 className={`${styles.actionBtn} ${styles.iconBtn}`}
                                 onClick={(event) =>
                                    togglePopupAction(user.userId, event)
                                 }
                              >
                                 <TbDotsVertical size={MEDIUM_ICON_SIZE} />
                              </button>
                              {activePopup === user.userId && (
                                 <Popup
                                    show={isPopupVisible}
                                    close={closePopupAction}
                                    position={popupPosition}
                                 >
                                    <div className={styles.popupWrapper}>
                                       <div className={styles.popupContent}>
                                          <button
                                             type="button"
                                             className={styles.iconCta}
                                          >
                                             <TbEdit size={POPUP_ICON_SIZE} />
                                             Edit details
                                          </button>
                                          <button
                                             type="button"
                                             className={styles.iconCta}
                                          >
                                             <TbFileArrowRight
                                                size={POPUP_ICON_SIZE}
                                             />
                                             Export details
                                          </button>
                                          <button
                                             type="button"
                                             className={`${styles.deleteBtn} ${styles.iconCta}`}
                                          >
                                             <TbTrash size={POPUP_ICON_SIZE} />
                                             Delete user
                                          </button>
                                       </div>
                                    </div>
                                 </Popup>
                              )}
                           </div>
                           {index !== currentUsers.length - 1 && (
                              <div className={styles.line}></div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
               <div className={styles.pagination}>
                  <TbArrowLeft
                     className={styles.iconBtn}
                     onClick={handlePreviousPage}
                     size={16}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                     <button
                        key={index}
                        type="button"
                        className={
                           currentPage === index + 1 ? styles.active : ""
                        }
                        onClick={() => handlePageChange(index + 1)}
                     >
                        {index + 1}
                     </button>
                  ))}
                  <TbArrowRight
                     className={styles.iconBtn}
                     onClick={handleNextPage}
                     size={16}
                  />
               </div>
            </section>
         </main>
      </Layout>
   );
};

export default UserManagement;
