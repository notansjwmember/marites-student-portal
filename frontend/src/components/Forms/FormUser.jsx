import React from "react";

import UserIcon from "components/ui/UserIcon/UserIcon";
import { FormInput, FormSelect } from "components/ui/Form";
import { useTogglePassword } from "hooks";
import { useForm } from "react-hook-form";

import styles from "./FormUser.module.scss";
import userIcon from "assets/images/profile.jpg";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { TbCloudDownload } from "react-icons/tb";
import { FormStudent } from "./FormStudent";

export const FormUser = ({
   role,
   setShowPopup,
   createAccount,
   closePopup,
   onNext,
   isRegister,
}) => {
   const [showPassword, togglePasswordVisibility] = useTogglePassword();

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();

   const onCreateSubmit = async (data) => {
      const yearLevel = parseInt(data.yearLevel);
      const birthDateString = data.birthDate;
      const birthDate = new Date(birthDateString);

      const userData = { ...data, birthDate, yearLevel };
      const response = await createAccount(userData, role.toString(), reset);

      if (response.ok) setShowPopup(true);
   };

   const MEDIUM_ICON_SIZE = 22;

   return (
      <form
         className={styles.formContainer}
         onSubmit={handleSubmit(onCreateSubmit)}
         autoComplete="off"
      >
         <div className={styles.twoColumn}>
            <h4>Name</h4>
            <div className={styles.twoColumn}>
               <FormInput
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  register={register}
               />
               <FormInput
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  register={register}
               />
            </div>
         </div>
         <div className={styles.line}></div>
         <div className={styles.twoColumn}>
            <h4>Birthdate</h4>
            <FormInput type="date" name="birthDate" register={register} />
         </div>
         <div className={styles.line}></div>
         <div className={styles.twoColumn}>
            <h4>Gender</h4>
            <FormSelect
               name="gender"
               value="gender"
               options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
               ]}
               register={register}
            />
         </div>
         <div className={styles.line}></div>
         <div className={styles.twoColumn}>
            <h4>Login</h4>
            <div className={styles.twoColumn}>
               <FormInput
                  type="text"
                  name="username"
                  placeholder="Username"
                  register={register}
               />
               <div className={styles.formItem}>
                  <div className={styles.inputMerge}>
                     <input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                     />
                     <span
                        className={styles.inputIcon}
                        onClick={togglePasswordVisibility}
                     >
                        {showPassword ? (
                           <IoEyeOffOutline color="gray" size={20} />
                        ) : (
                           <IoEyeOutline color="gray" size={20} />
                        )}
                     </span>
                  </div>
               </div>
            </div>
         </div>
         <div className={styles.line}></div>
         <div className={styles.twoColumn}>
            <h4>Contact</h4>
            <div className={styles.twoColumn}>
               <FormInput
                  type="text"
                  name="email"
                  placeholder="Email address"
                  register={register}
               />
               <div className={styles.formItem}>
                  <label>
                     {errors.phoneNum && (
                        <span className={styles.errorMsg}>
                           ({errors.phoneNum.message})
                        </span>
                     )}
                  </label>
                  <input
                     placeholder="12345678910"
                     type="tel"
                     {...register("phoneNum", {
                        pattern: {
                           value: /^\+?\d{1,3}?\s?\d{10}$/,
                           message: "Phone number must be 10 digits",
                        },
                     })}
                  />
               </div>
            </div>
         </div>
         <div className={styles.line}></div>
         <div className={styles.twoColumn}>
            <h4>Profile Photo</h4>
            <div className={styles.changePhotoContainer}>
               <UserIcon
                  image={userIcon}
                  desc="New user's profile photo"
                  size={80}
               />
               <div className={styles.changePhoto}>
                  <button type="button" className={styles.iconBtn}>
                     <TbCloudDownload size={MEDIUM_ICON_SIZE} />
                  </button>
                  <p>
                     <span>Click to upload</span> or drag and drop <br />
                     SVG, PNG, or JPG (max. 2MB)
                  </p>
               </div>
            </div>
         </div>
         <div className={styles.line}></div>
         {role === "student" && <FormStudent register={register} />}
         <div className={styles.buttonContainer}>
            {isRegister ? (
               <a href="login" className={styles.ctaAnchor}>
                  Already have an account?
               </a>
            ) : (
               <button
                  onClick={closePopup}
                  type="button"
                  className={`${styles.cancelBtn} ${styles.ctaBtn}`}
               >
                  Cancel
               </button>
            )}
            <button
               type="submit"
               onClick={onNext}
               className={`${styles.primaryBtn} ${styles.ctaBtn}`}
            >
               Create account
            </button>
         </div>
      </form>
   );
};
