export const nameRegex = /^[a-zA-Z]+$/;
export const fullnameRegex = /^[A-Za-z\s]*$/;
export const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const phoneRegex = /(0|91)?[6-9][0-9]{9}/;
export const passwordRegex =
  /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{6,20}$/;
export const postalCodeRegex = /^[0-9A-Z]{2,4}[ -]?[0-9A-Z]{3,4}$/;
export const imageUrlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/;
export const couponCodeRegex = /^[A-Z][A-Z0-9]{4,14}$/;