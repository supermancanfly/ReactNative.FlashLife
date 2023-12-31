const isDevelopment = false

export const ConstantValues = {
  IS_DEVELOPMENT: isDevelopment,
  API_KEY_WEATHER: "13f9220db080aae56568555f715e5435",
  API_KEY_NOTIFICATIONS: "",
  // BASE_API_URL: "https://instaccess.co.za/instaccess_backend/index.php/api/",                  //production
  // COMPANY_ID_STR: "37",       //instaccess
  COMPANY_ID_STR: "54",       //flash life


  /* FOR TESTING USING BELOW URLS IN INSTACCESS DEBUG */
  // www.instaccess.com/dev/#
  // BASE_API_URL: "https://flash-dev.instaccess.com/instaccess_backend/index.php/v2/",                 //development
  // URL_REDEM_POINTS_STR: "https://flash-dev.instaccess.com/api_gateway/index.php/import/club/monthly", //development
  // URL_GATEWAY_BASE_URL: "https://flash-dev.instaccess.com/api_gateway/index.php/",
  // URL_WEB: "https://flash-dev.instaccess.com/dev/",

  URL_GATEWAY_GEOREP: isDevelopment ? 'https://flash-dev.instaccess.com/' : 'https://life.flash.co.za/',


  /* FLAH LIVE URLS */
  //  life.flash.co.za/app
  BASE_API_URL: "https://life.flash.co.za/instaccess_backend/index.php/v2/",                  //production
  URL_REDEM_POINTS_STR: "https://life.flash.co.za/api_gateway/index.php/import/club/monthly",  //production
  URL_GATEWAY_BASE_URL: "https://life.flash.co.za/api_gateway/index.php/",
  URL_WEB: "https://life.flash.co.za/app/",


  URL_CREATE_SURVEY_STR: "surveySubmissions/create",
  URL_UPDATE_CONTENT_FEED_STR: "ContentFeed/update/",
  URL_CONTENT_FEED_STR: "ContentFeed/fetch",
  URL_CONTENT_FEED_STR: "ContentFeed/fetch",
  URL_USER_LEVEL_PERMISSIONS_STR: "userPermissions",
  URL_CONTENT_CATEGORIS_STR: "categories",
  URL_CONTENT_FILES_STR: "contentFiles",
  URL_FOOTER_NAVIGATION_ORDER: "navOrder",
  URL_USER_REGISTER: "user/register",
  URL_USER_LOGIN: "user/login",
  USERS_STR: "users",
  URL_LOGOUT: "users/logout",
  URL_COUNTRYIS: "countries",
  URL_STATES: "states",
  URL_CITYS: "cities",
  URL_LOCATIONS: "locations",
  URL_WEBLINKS: "webLinks",
  URL_COMANIES: "companies",
  URL_ENTER_EMAIL_ADDRESS_STR: "Enter Email Address",
  URL_SYSTEM_QUESTIONS: "SystemQuestions",
  URL_COMPANY_QUESTIONS: "CompanyQuestions",
  URL_CREATE_SYSTEM_QUESTIONS: "SystemQuestionsSubmissions/create",
  URL_ACTIVITIES: "activities",
  URL_FAVRITE_LOCATION: "location/update/",
  URL_LOCATION_CREATE: "location/create",
  URL_API_CHANGE_PASSWORD: 'user/changePassword',
  URL_CHECKOUT: "activity/update/",
  URL_ACTIVITY_CREATE: "activity/create",
  URL_WRONG_QUESTIONS: "activity/getWrongQuestions",
  URL_CLUB_CYCLES: "clubCycles",
  URL_NOTES: "notes",
  URL_UPDATE_NOTE: "note/update/",
  URL_NOTE_CREATE: "note/create",
  URL_TRIGGER_QUESTIONS: "NonAppUsers/fetchTriggerQuestions",
  URL_LOCATION_SETTINGS: "LocationSettings",
  URL_DIVISIONS: "divisions",
  URL_NONAPP_USER_CREATE: "NonAppUsers/create",
  URL_NON_APP_USER_SUBMITQUESTIONS: "SystemQuestionsSubmissionsController/create",
  URL_NON_APP_USER_GET_FETCHING_SYSTEMQUESTIONS: "NonAppUsersController/fetchScreeningQuestions",
  URL_USER_UPDATE: "user/update/",
  URL_REFERENCES: "references",
  URL_DEPARTMENTS: "departments",
  URL_FORGOT_PASSWORD_STR: "user/forgotPassword",
  URL_CREATE_GEO_ADDRESS: "location/getCityStateCountryids",
  URL_FORMS: "forms",
  URL_FORM_QUESTIONS: "formQuestions",
  URL_PURPOSE_OF_VISIT: "purposeVisiting",
  URL_SCAN_OUT: "gateActivity/scanOut",
  URL_CAPACITY_STR: "Capacity",
  URL_CREATE_GATE_ACTIVITY: "gateActivity/create",
  URL_UPDATE_GATE_ACTIVITY: "gateActivity/update/",
  URL_DELETE_GATE_ACTIVITY: "gateActivity/delete/",
  URL_GET_GATE_ACTIVITIES: "gateActivities",
  URL_FORM_SUBMISSION_STR: "formSubmission/create_v2",//"formSubmission/create",
  URL_FORM_SUBMISSION_ANSWER_STR: "formSubmissionAnswer/create",
  URL_LOYALTY_CARDS_STR: "loyaltyCards",
  URL_LOYALTY_CARD_CREATE_STR: "loyaltyCard/create",
  URL_LOYALTY_CARD_DELETE_STR: "loyaltyCard/delete/",
  URL_LOYALTY_CARD_UPDATE_STR: "loyaltyCard/update/",
  URL_WHITE_LABEL_SETTINGS_STR: "whitelabelSettings",
  URL_FEATURE_PERMISSINS: 'featurePermissions',
  URL_VALUE_NOMINATIONS: 'valueNominations',
  URL_SUPPORT_TYPES: "supportType",
  URL_FRAUD_TYPES: "fraudType",
  URL_WELBEING_VALUES: "wellBeing",
  URL_SUPPORT_SEND_MAIL: "/supportSendMail",
  URL_FRAUD_SEND_MAIL: "/fraudSendMail",
  URL_VALUES_STR: "values",
  URL_CLUB_MONTHLY_STR: "clubMonthly",
  URL_CLUB_SCORE_STR: "clubScoring",
  URL_REWORDS_STR: "rewards",
  URL_REWORDCONVERSION_STR: "rewardConversion",
  URL_REWORDS_REDEMPTION_STR: "redemption/RewardRedemption",
  URL_LUNCH_OREDERS_CREATE_STR: "lunchOrders/create",
  URL_CURRENT_LUNCH_SETUP: "lunchOrders/backendCurrent",
  URL_CURRENT_LUNCH_ITEMS_GET: "lunchOrders",
  URL_DELETE_CURRENT_ORDER_ITEM: "lunchOrders/delete/",
  URL_LUNCH_ORDERS: "lunchOrders",
  URL_LUNCH_RULES: "lunchRules/getLunchRules",
  URL_IMPORT_VALUE_NOMINATIONS: "import/value/nominations",
  URL_ETHICS_DISCLOSURE: 'smtpEthicsDisclosure',
  URL_MAINTENANCE_MAIL: 'smtpMaintenanceIssue',
  FORGOT_EMAIL_TITLE_STR: 'Your password reset email has been sent!',
  USER_TYPE_PERSONAL_STR: "Personal",
  USER_TYPE_ADMIN_STR: "Admin",
  URL_PROFILE_FILES_CREATE_STR: "profileFiles/create",
  URL_GET_PROFILE_FILES_STR: "profileFiles",
  URL_PROFILE_FILE_DELETE_STR: "profileFiles/delete/",
  URL_PROFILE_FILE_UPDATE_STR: "profileFiles/update/",
  URL_FLASH_BOOK: "flashBookVirtualForms/flashBook",
  URL_VIRTUAL_TRANSACTION: "flashBookVirtualForms/virtualTransactions",
  USER_TYPE_SUPER_ADMIN_STR: "Super Admin",
  USER_TYPE_ADMIN_DEVICE_STR: "Admin Device",
  USER_TYPE_GATE_DEVICE_STR: "Gate Device",
  USER_TYPE_EMPLOYEE_STR: "Employee",
  USER_TYPE_MEMBER_STR: "Member",
  PERSONAL_STR: "Personal",
  BUSSINESS_STR: "Business",
  FIRSTNAME_STR: "FIRST NAME",
  LAST_NAME_STR: "LAST NAME",
  MOBILE_NUMBER_STRING: "MOBILE NUMBER",
  ADD_NOTE: "Add Note",
  EMAIL_STR: "EMAIL",
  PASSWORD_STR: "PASSWORD",
  CONFIRM_PASSWORD_STR: "CONFIRM PASSWORD",
  CREATE_ACCOUNT_STR: "CREATE ACCOUNT",
  ALREADY_HAVE_AN_ACCOUNT_STR: "Already have an account?",
  LOGIN_HERE_STR: "Login Here",
  COMPANY_STR: "COMPANY",
  FIRSTNAME_ADMIN_STR: "FIRST NAME(ADMIN)",
  LASTNAME_ADMIN_STR: "LAST NAME(ADMIN)",
  LAND_LINE_STR: "LANDLINE",
  CELL_NUMBER_STR: "CELL NUMBER",
  ADDRESS_STR: "ADDRESS",
  HOME_LOCATION_STR: "Home Location",
  CLICK_HERE_GET_GEO_ADDRESS: "Click to Geo Locate Address",
  CITY_STR: "CITY",
  STATE_STR: "STATE",
  COUNTRY_STR: "COUNTRY",
  POSTAL_CODE_STR: "POSTAL CODE",
  LOGIN_STR: "SIGN IN",
  DONT_HAVE_AN_ACCOUNT_STR: "Don't have an account",
  CREATE_ACCOUNT_STR_SMALL: "Create Account",
  FORGOT_PASSWORD_STR: "Forgot Password",
  HOME_STR: "Home",
  NEWS_STR: "News",
  CHECKIN_STR: "Check In",
  EMPLOYEE_STR: "Employee",
  LEARNING_AND_TRAINING_STR: "FlashBook",
  PROFILE_STR: "Profile",
  CLUB_STR: "Club",
  FLASH_CLUB_STR: "Flash Club",
  DASHBOARD_STR: "Dashboard",
  SUBMISSIONS_STR: "Submissions",
  REWORDS_STR: "Rewards",
  MORE_STR: "More",
  MAIN_GATE_STR: "Geo Rep Main Gate",
  SERACH_STR: " ",
  BUSSINESS_CENTER_STR: "The Business Centre",
  PERSONAL_DETAILS_SHARED_STR: "PERSONAL DETAILS SHARED",
  YES_STR: "Yes",
  NO_STR: "No",
  PERSON_VISIT_STR: "PERSON VISITING",
  INSERT_TEMARATURE_STR: "INSERT TEMPERATURE",
  PLEASE_SIGN_BELOW_STR: "PLEASE SIGN BELOW",
  SCREENING_QUESTIONS_STR: "SCREENING QUESTIONS",
  ARE_YOU_WEARING_A_PROTECTIVE_MASK_STR: "ARE YOU WEARING A PROTECTIVE FACE MASK?",
  SUBMIT_STR: "SUBMIT",
  REQUEST_ENTRY_STR: "REQUEST ENTRY",
  FORM_QUESTIONS_SUBMIT_STR: "SUBMIT",
  SELECT_DATE_STR: "Select Date",
  ACCESS_DENIED_STR: "Access Denied",
  CLOSE_STR: "CLOSE",
  PLEASE_SPEAK_SECURITY_OFFICER: "Please speak to security officer",
  OR_RECEPTION_FORTHER_INFORMATION_STR: "or reception for further information",
  OR_RECEPTION_TO_GAIN_ACCESS_STR: "or reception to gain access",
  ACCESS_PENDING_STR: "Access Pending",
  ACCESS_APPROVED_STR: "Access Approved",
  VISITER_ARAIVAL_STR: "Visitor Arraival",
  EXIT_APPROVED_STR: "Exit Approved",
  SEARCH_NAME_STRING: "Locations",
  VISITOR_ARRAIVAL_STR: "Visitor Arrival",
  LUNCH_ORDRES_STR: "Lunch Orders",
  MONTHLY_REMAINDER_STR: "Monthly Reminder",
  REMAINDER_MOTH_BODY_MSG_STR: "Please note that you have not yet achieved the required Club points for the month. Please visit Club > Dashboard to see more",
  BOOKINGS_ORDERS_OPEN_NOW: "Please visit the Open Tab in your Bookings,as orders are now open.",
  APPROVED_FOR_ACCESS_WAITING_STR: "has been approved for access and waiting for you at reception",
  SEND_RESPONSE_STR: "SEND RESPONSE",
  SEND_STR: "Send",
  USE_MY_DIGITAL_SIGNATURE_STR: "Use My Digital Signature",
  ACCESS_CONTROL_STR: "Access Control",
  NEW_MESSAGE_STR: "New Message",
  APPROVE_STR: "Approve",
  REJECTED_STR: "Reject",
  COMMENT_STR: "Comment",
  ID_NUMBER_STR: "ID Number",
  ACCESS_STR: "Access",
  COMES_FROM_STR: "Comes from",
  EMAIL_STR_S: "Email",
  MOBILE_NUMBER_STR_S: "Mobile Number",
  STREET_ADDRESS_STR: "Street Address",
  CITY_STR_S: "City",
  STATE_OR_PROVENCE_STR: "State/Province",
  COUNTRY_STR_S: "Country",
  STATE_STR_S: "State",
  ZIP_OR_POSTCODE_STR: "Zip/Postcode",
  SHARING_PREFERENCES_STR: "Information Sharing Preferences",
  NOTIFICATIONS_STR: "Notifications",
  HOME_OFFICE_STR: "Home Office",
  HOME_OFFICE_NAME_STR: "Home Office Name",
  HOME_OFFICE_INFORMATION: "Home Office Information",
  ENABLE_ACCESS_CONTROL_NOTIFICATIONS_STR: "Enable Access Control Notifications",
  SHARE_EMAIL_STR: "Share Email",
  SHARE_ID_NUMBER_STR: "Share ID Number",
  SHARE_ADDRESS_STR: "Share Address",
  SHARE_PROFILE_PHOTO_STR: "Share Profile Photo",
  DIGITAL_SIGNATURE_STR: "Digital Signature",
  DELETE_STR: "Delete",
  ADD_STR: "ADD",
  ADD_NEW_STR: "Add New",
  EDIT_PROFILE_STR: "EDIT PROFILE",
  FILES_STR: "Files",
  YOU_ARE_APPROVED_FOR_ACCESS_STR: "You are approved for access",
  CHECKOUT_STR: "CHECKOUT",
  CHECK_IN_FOR_STR: "CHECKED IN FOR",
  HOURS_STR: "HOURS",
  CURRENT_LOCATION_STR: "Current Location",
  MIN_STR: "MIN",
  SECS_STR: "SEC",
  LEAVE_A_NOTE_STR: "Leave a note",
  LEAVE_A_REVIEW_STR: "Leave a review",
  RATE_YOUR_EXPERIENCE: "Rate your experience",
  DESCRIBE_YOUR_EXPERIENCE_STR: "Describe your experience",
  SAVE_STR: "SAVE",
  SMALL_SAVE_STR: "Save",
  WELCOME_CRAIGE_LIST_STR: "Welcome ",
  EMPLOYEE_ENTRY_STR: "EMPLOYEE ENTRY",
  VISITOR_ENTRY_STR: "VISITOR ENTRY",
  EMPLOYEE_NUMBER_STR: "Employee Number",
  EMPLOYEECODE_OR_IDNUMBER: "Employee Code / ID / Email",
  HOME_CHOICE_WYNBERG_RECEPTION: "Homechoice Wynberg Reception",
  WHERE_DID_YOU_TRAVEL_FROM_STR: "WHERE DID YOU TRAVEL FROM?",
  WHERE_WERE_YOU_STR: "WHERE WERE YOU",
  DATE_DEPARTED_STR: "DATE DEPARTED",
  DATE_RETURNED_STR: "DATE RETURNED",
  DATE_OF_THE_TEST_STR: "DATE OF THE TEST",
  SELECT_DATE_STR: "Select Date",
  EMPLOYEE_CODE_STR: "EMPLOYEE CODE",
  EMAIL_ADDRESS_STR: "EMAIL ADDRESS",
  USER_CREATED_SUCCESS_ALERT_STR: "User created successfully",
  OK_ALERT_STR: "OK",
  USER_CREATED_FAILED_ALERT_STR: "User created failed",
  INVALID_LOGIN_CREDENTIALS_ALERT_STR: "Invalid login credentials",
  ENTER_EMAIL_ADDRESS_ALERT: 'Please enter email address',
  ENTER_VALID_EMAIL_ADDRESS_ALERT: 'Please enter valid email address',
  ENTER_PASSWORD_ALERT: 'Please enter password',
  PASSWORD_LENGTH_ALERT: 'Password must be more than 5 letter',
  SCAN_QR_STR: "SCAN",
  QR_STR: "QR",
  SELECT_COUNTRY_STR: "Select Country",
  SELECT_STATE_STR: "Select State",
  SELECT_CITY_STR: "Select City",
  CONFIRM_CLOSE_APP_ALERT_STR: 'Do you want to quit the app?',
  CANCEL_STR_S: "Cancel",
  CANCEL_STR: "CANCEL",
  STOP_SCAN_STR: "Stop Scan",
  PLEASE_WAIT_GETINGLOCTAION: "Please Wait Getting Location",
  GETTING_LOCATION_STR: "Loading Current Location address",
  LOADING_STR: "Loading...",
  PLEASE_WAIT_STR: "Please wait..",
  LOGOUT_STR: "Logout",
  PLEASE_ENTER_EMPLOYEE_NUMBER_STR: "Please enter employee number",
  PLEASE_ENTER_VISITOR_STR: "Please enter visitor number",
  APPROVED_SMALL_STR: "approved",
  DENIED_SMALL_STR: "denied",
  PENDING_SMALL_STR: "pending",
  ONSITE_STR: "Onsite",
  YOU_ARE_ALREADY_CHECKED_IN_OTHER_LOCATION_STR: "You are already checked into another location. Please Check out before trying to access a new location",
  COMPANY_NAME_STR: "Company",
  DIVISION_NAME_STR: "Division",
  DEPARTMENT_NAME_STR: "Department",
  LOCATION_NAME_STR: "Location",
  CELL_NUMBER_SMALL_STR: "Cell Number",
  EMAIL_ADDRESS_SMALL_STR: "Email Address",
  ADDRESS_SMALL_STR: "Address",
  MSISDN_NUMBER_STR: "MSISDN Number",
  DIGITAL_SIGNATURE_ADDED_SUCCESSFULLY: "Signature Added Successfully",
  EDIT_PROFILE_SUCCESSFULLY_STR: "Profile updated successfully",
  SAVED_SUCCESSFULLY_STR: "Save Details Successfully",
  FORM_SUBMITED_SUCCESSFULLY_STR: "Form Successfully Submitted",
  INTERNETWEAKPERFORMANCE: "Weak Internet Connection, please try another navigation option",
  RESET_PASSWORD_STR: "Reset Password",
  RESET_YOUR_PASSWORD_STR: "Reset Your Password",
  FORGOT_PASSWORD_STR: "Forgot Password",
  LEAVE_ANOTE_SAVEALERT_STR: "Note Saved Successfully",
  LEAVE_AREVIEW_SAVEALERT_STR: "Review Saved Successfully",
  CHANGEPASSWORD_STR: "Change Password",
  CURRENT_PASSWORD_PLACEHOLDER_NAME: 'Current Password',
  NEW_PASSWORD_PLACEHOLDER_NAME: 'New Password',
  CONFIRM_PASSWORD_PLACEHOLDER_NAME: 'Confirm Password',
  ALERT_MESSAGE_FOR_ENTER_CURRENTPASSWORD: 'please enter current password',
  ALERT_MESSAGE_FOR_ENTER_NEW_PASSWORD: 'please enter new password',
  ALERT_MESSAGE_FOR_ENTERCONFIRM_PASSWORD: 'please enter confirm password',
  ALERT_MESSAGE_FOR_CHECKPASSWORDLENGTH: 'password  must be more than 5',
  ALERT_MESSAGE_FOR_CURRENT_PASSWORD_NOT_MATCHED_WITH_NEW_PASSWORD: 'Passwords do not match. Please try again',
  ALERT_MESSAGE_TITLE_PASSWORDCHANGE_SUCCSESS: 'Your Password has been successfully updated',
  ALERT_PLEASE_ENTER_VALID_CURRENTPASSWORD_STR: "Passwords do not match. Please try again",
  SELECTED_STR: "Selected",
  NO_DATA_FOUND_STR: "No Data Found",
  SCANQR_STR: "Scan Code",
  INSER_TEXT_STR: "Insert Text",
  ENTRY_QUESTIONS_ARE_SET_FOR_LOCATION_STANDARDS: "Entry questions are set per the location's standards",
  REFERENCES_STR: "Covid - 19 References",
  UPLOAD_FRONT_CARD_STR: "Upload Front Card",
  UPLOAD_BACK_CARD_STR: "Upload Back Card",
  SELECT_DEPARTMENT_STR: "Select Department Visiting",
  SELECT_PERSON_STR: "Select Person Visiting",
  SELECT_PERSON_WELBEING_STR: "Select Person",
  SELECT_PURPOSE_OF_VISIT_STR: "Select Purpose of Visit",
  PASSWORD_STR_S: "Password",
  REGISTER_ENTRY_STR: "Register Entry",
  SCAN_EXIT_STR: "Scan Exit",
  SCAN_CAR_LICENCE_STR: "Scan Car Licence",
  SCAN_ID_OR_DRIVER_LICENCE_STR: "Scan ID / Drivers License",
  NUMBER_OF_PEOPLE_STR: "Number of People",
  PURPOSE_OF_VISIT_STR: "Purpose of Visit",
  PERSON_VISITING_STR: "Person Visiting",
  SUBMIT_STR_S: "Submit",
  FORMS_STR: "Forms",
  NO_OF_FIELDS: "No.of Fields",
  ADDED_DATE: "Added Date",
  FLASH_MODE_STR: "Flash Mode",
  LOYALTYCARDS_STR: "Loyalty Cards",
  LOYALTY_CARD_STR: "Loyalty Card",
  FRONT_CARD_STR: "Front Card",
  BACK_CARD_STR: "Back Card",
  CARD_NAME_STR: "Card Name",
  TOTAL_POINTS_STR: "TOTAL POINTS",
  CYCLES_COMPLETED_STR: "Cycles Completed",
  GRACE_MONTH_AVAILABLE_STR: "Grace Month Available",
  NO_STR: "No",
  CATEGORIES_STILL_TO_EARN_STR: "Categories Still to Earn",
  VALUES_NOMINATIONS_STR: "Values Nominations",
  MARKET_VISIT_STR: "Market Visit",
  WELL_NESS_STR: "Wellness",
  WE_ARE_ALL_IN_STR: "We Are All In",
  WE_ARE_BRAVE_STR: "We Are Brave",
  WE_HAVE_EACH_OTHERS_BACK: "We Have Each Other's Back",
  BY_STR: 'By',
  CARD_FRONT_IMAGE_STR: "Card Front Image",
  CARD_BACK_IMAGE_STR: "Card Back Image",
  UPLOAD_STR: "Upload",
  UPLOAD_A_PHOTO_STR: "Upload a Photo",
  UPLOAD_A_FILE_STR: "Upload a File",
  FLIP_IMAGE: "Flip Image",
  UPDATE_STR: "Update",
  UPDATE_CARD_STR: "Update",
  DELETE_CARD_STR: "Delete",
  POINTS_BY_MONTH_STR: "Actual Points by Month",
  JAN_STR: "Jan",
  FEB_STR: "Feb",
  MAR_STR: "Mar",
  APRL_STR: "Apr",
  MAY_STR: "May",
  JUNE_STR: "Jun",
  JULY_STR: "Jul",
  AUG_STR: "Aug",
  SEP_STR: "Sep",
  OCT_STR: "Oct",
  NOV_STR: "Nov",
  DEC_STR: "Dec",
  FIREBASE_API_KEY_STR: "AAAApMr-ZD0:APA91bGvI-rQEx08NPZPe87sKoEC23kVXz2rSwInZbcccGwozY9jEab-KgVpGfSlloQkmLY_RBqartRxT-OB687HpL_eXM7P3DdHwDbpxKP_Rzo4wqzXU9vkxQfUTAOcCZGnu-dposTu",
  SHOW_MORE_STR: "Load More",
  WEB_LINKS_STR: "Web Links",
  NO_PERMISSIONS_ALLOWED_STR: "Cannot login as no permissions allowed",
  SUPPORT_STR: "Support",
  REPORT_FRAUD_STR: "Report Fraud",
  REPORT_SPAM_PHISHING_STR: "Report Spam/Phishing",
  ETHICS_DISCLOSURE_STR: "Make an Ethics Disclosure",
  OFFICE_MAINTENANCE: "Office Maintenance",
  SUPPORT_TYPE_STR: "Support Type",
  CONTACT_NUMBER_STR: "Contact Number",
  PROVIDE_SPECIFIC_DETAILS_SUPPORT_REQUEST_STR: "Provide specific details of support request...",
  FRAUD_TYPE_STR: "Fraud Type",
  ADD_FROM_GALLORY_STR: "Add From Gallory",
  OPTIONSL_STR: "Optional",
  PROVIDE_SPECIFIC_FRAUD_INCIDENT_DETAILS_STR: "Provide specific details on the fraud incident..",
  TAKE_PHOTO_STR: "Take Photo",
  SELECT_FRAUD_TYPE_ALERT_STR: "Please select Fraud Type",
  SELECT_SUPPORT_TYPE_ALERT_STR: "Please select Support Type",
  POINTS_AVAILABLE_STR: "Redeemable Points",
  IWANT_ONE_STR: "I want one",
  VOUCHERS_STR: "Vouchers",
  REDIME_NOW_STR: "REDEEM NOW",
  SELECT_QUANTITY_STR: "Select Quantity",
  BOOKINGS_STR: "Bookings",
  MESSAGES_STR: "Messages",
  CONTENT_LIBRARY_STR: "Content Library",
  LUNCH_STR: "Lunch",
  TRAVEL_STR: "Travel",
  DESK_STR: "Desk",
  POINTS_REQUIRED_STR: "Points Required",
  SPECIFIC_ORDER_DETAILS_STR: "Add your specific order requests here...",
  ADDITIONAL_NOTES_STR: "Additional Notes",
  CURRENTLY_UNAVAILABLE_STR: "Currently Unavailable",
  NEW_ORDERS_CURRENTLY_UNAVAILABLE_STR: "New order submissions are currently unavailable please check again next Tuesday after 10am.",
  CANCEL_ORDER_STR: "Are you sure you want to Cancel this order? This action cannot be reversed.",
  LUNCH_SETUP_OPEN_STR: "lunchSetup",
  LUNCH_ORDER_SUBMITED_SUCCESSFULLY_STR: "Lunch Order Submitted",
  TAP_TO_VIEW_STR: "Tap to view",
  FLASH_SECTION_HELP_STR: "Help",
  FOOD_SECTION_STR: "Lunch Orders",
  Flash_SECTION_LEARNING: "Flash Learning",
  FLASH_SERVEYS_SECTION_STR: "Surveys",
  FLASH_BUSINESS_DIRECTORY_SEC_STR: "Business Directory",
  FLASH_WELNESS_SEC_STR: "Well-being",
  FLASH_USEFULL_LINKS_STR: "Useful links",
  ACCOUNT_SETTINGS_STR: "Account Settings >",
  ITSUPPORT_MARKETING_STR: "IT Support, Marketing and more >",
  CUTOFFS_ORDERS_STR: "Cut-off is Thurs 11:00. Order now >",
  VICTIM_FRAUD_STR: "Victim of fraud? Report it now >",
  VICTIM_SPAM_PHISHING_STR: "Report attempts of Spam or Phishing",
  KNOWLEDGE_UP_EARN_POINTS_STR: "Knowledge up. Earn Points.",
  LOOKING_FOR_SOME_ONE_STR: "Looking for someone?",
  FEELINGS_LOW_STR: "Need extra support? We’re here for you.",
  NOMINATE_FOR_VALUES_STR: "Nominate for Values",
  WIN_AND_UBER_EATS: "Give us your feedback",
  URL_SUPPORT_SMTPMAIL: "supportType/smtpSupportMail",
  URL_REPORT_FRAUD_SMTPMAIL: "fraudType/smtpFraudMail",
  URL_WELL_BEINGSMTPMAIL: "wellBeing/smtpWellBeingMail",
  LOGIN_WEAK_INTERNET_MESSAGE: "Weak Internet Connection. Please check connection and try again",
  FETCH_API_TIME_OUT: 150000,
  // https://flash-dev.instaccess.com/instaccess_backend_dev/index.php/v2/supportType/smtpSupportMail
  // v2/fraudType/smtpFraudMail

  DATE: "Date",
  VENDOR: "Vendor",
  VALUE: "Value",
  REDEEMED: "Redeemed",
  CODE: "Code",
  FCM_GOOGLE_API: 'https://fcm.googleapis.com/fcm/send',
  FIREBASE_API_KEY: 'AAAApMr-ZD0:APA91bGvI-rQEx08NPZPe87sKoEC23kVXz2rSwInZbcccGwozY9jEab-KgVpGfSlloQkmLY_RBqartRxT-OB687HpL_eXM7P3DdHwDbpxKP_Rzo4wqzXU9vkxQfUTAOcCZGnu-dposTu',
  BIRTHDAY_NOTIFICATION_KEY: 'Birthdays',
  FLASH_CLUB_NOTIFICATION: 'Flash Club',
  CALL_CENTER_LOCATION_ID: '188',
  SUBMIT_BUTTON_SIZE: 40,
  MAX_TEXTINPUT_LENGTH: 500,
  BOTTOM_TAB_HEIGHT: 70,
  MESSAGE_LIST: "Message List",
  TRAINING_STR: 'Training',
  HOME_TAB: 'Home',
  NEWS_TAB: 'News',
  CLUB_TAB: 'Club',
  FLASK_BOOK_TAB: 'FlashBook',
  BACK_TO_TRAINING_COURSES: 'Back To Training Courses',
  REVIEW_COURSE_LESSONS: "Review Course Lessons",
  BACK_TO_DASHBOARD: 'Back To Dashboard',
  REVIEW_ANSWERS: 'Review Answers',
  RETRY_QUIZ: 'Retry Quiz',
  CONTINUE: 'Continue',
  VOUCHER_VARIABLE_REWARD_TYPE: "Voucher-Variable",
  VOUCHER_REWARD_TYPE: "Voucher",

  /**LMS training base url */
  LMS_BASE_URL: 'https://qacms.flash.co.za/api/LMS/',
  LMS_IMAGE_URL: 'https://prod.za.flashcontentmanager.flash-infra.cloud/image',
  OLD_LMS_IMAGE_URL: 'https://qacms.flash.co.za/image/',
  NEW_LMS_BASE_URL: 'https://prod.za.flashcontentmanager.flash-infra.cloud/api/LMS/',
  GET_COURSES: 'GetCourses',
  GET_COURSES_BY_COURSE_ID: 'GetCourseFull',
  GET_LMS_DASHBOARD_API: `lms-tracking/index.php/user/dashboard`,
  GET_COURSE_PROGRESS_API: `lms-tracking/index.php/user/course-progress`,
  POST_COURSE_ACTIVITY: `lms-tracking/index.php/course/activity`,
  POST_QUIZ_SUBMISSION: `lms-tracking/index.php/course/quiz-submission`,

}






























/* currently we are not using below urls */
  // www.instaccess.co.za/dev/#
  // BASE_API_URL: "https://instaccess.co.za/instaccess_backend_dev/index.php/v2/",                 //development
  // URL_REDEM_POINTS_STR: "https://instaccess.co.za/api_gateway_dev/index.php/import/club/monthly", //development
  // URL_GATEWAY_BASE_URL:"https://instaccess.co.za/api_gateway_dev/index.php/",
  // URL_WEB:"https://instaccess.co.za/app/",



  //instaccess.co.za/app/#
  // BASE_API_URL: "https://instaccess.co.za/instaccess_backend/index.php/v2/",                  //production
  // URL_REDEM_POINTS_STR: "https://instaccess.co.za/api_gateway/index.php/import/club/monthly",  //production
  // URL_GATEWAY_BASE_URL: "https://instaccess.co.za/api_gateway/index.php/",
  // URL_WEB:"https://instaccess.co.za/app/",


   // https://instaccess.co.za/dev/
  // life.flash.co.za/dev/#
  // BASE_API_URL: "https://life.flash.co.za/instaccess_backend_dev/index.php/v2/",                 //development
  // URL_REDEM_POINTS_STR: "https://life.flash.co.za/api_gateway_dev/index.php/import/club/monthly", //development
  // URL_GATEWAY_BASE_URL:"https://life.flash.co.za/api_gateway_dev/index.php/",


