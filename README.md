# FindIt - The Bells University Lost and Found System

## ALGORITHM

**Step 1:** Load the React application environment.

**Step 2: Session Check**
- **IF (Session Exists):** Load user details and allow access to private pages (Report Item, Dashboard).
- **ELSE:** Redirect unauthorized attempts to the Home or Auth page.

**Step 3: User Registration & Login**
- User Inputs required data, validation of the info or user data is carried out.
- **IF:** unique data is already in use and matches records go to login form.
- **ELSE:** Create a user object with a unique ID, save it to the database and immediately start a session for the new user.

**Step 4: Item Management (Reporting Lost/Found)**
- After the user is authenticated and selects “Lost” or “Found”, they provide item details such as Item Name/Category, Detailed Description etc.
- THEN a unique Item ID is assigned, saved and added to the report list.
- The report is linked to the user for history tracking.

**Step 5: Discovery & Search (Browsing Items)**
- The items data is retrieved from the database, filtered by category, status and rendered as matched data.

**Step 6: Interaction & Notifications**
- User clicks an item card to see full specifics.
- When a user clicks "Report" on an item, a notification is generated: "Someone wants to talk to you about your item: [Name]".
- Notifications are stored and displayed in the owner's Dashboard.

**Step 7: Dashboard sections**
- User's name, email, and verification status is displayed.
- List of items reported by the user with "Edit" and "Mark as Resolved" options.
- Real-time alerts are present and Users can remove notifications if not interested.

## CHAPTER 2: LITERATURE REVIEW

### 2.1 Review of Existing Similar Applications
Effective Lost and Found management is critical for campus security and student welfare. Existing solutions range from informal physical systems to broad social media platforms.

#### 2.1.1 Physical Lost and Found Departments & Physical Notice Boards
Most universities traditionally rely on a central physical office (e.g., Student Affairs) or bulletin boards for lost items.
- **Limitations:** Limited accessibility, requires physical presence, and lacks real-time updates.

#### 2.1.2 Integrated Campus Portals (e.g., Generic University Portals)
Some institutions use integrated administrative portals that include simple "Notice" sections.
- **Limitations:** These are often non-interactive, cluttered with unrelated academic data, and do not support real-time user-to-user notifications or resolution tracking.

#### 2.1.3 Independent Web & Local Clients (e.g., FindIt, Dedicated Apps)
Dedicated platforms like "FindIt" provide a focused interface solely for item recovery.
- **Advantages:** Real-time data retrieval, dedicated categories (Electronics, Bags, etc.), and specialized status tracking (Lost vs. Found vs. Claimed).

### 2.2 Strengths and Weaknesses of Existing Projects
- **Strengths:** High visibility in social media groups (WhatsApp/Telegram).
- **Weaknesses:** Fragmentation, lack of security/verification (anyone can claim an item), no way to track if a case was actually resolved, and no structured database for searching past reports.

### 2.3 Technologies and Frameworks Used
While similar projects often utilize Python-based backends, this implementation leverages a modern Full-Stack TypeScript/JavaScript environment for real-time responsiveness.

#### 2.3.1 Encryption and Security Libraries
- **Passport.js & scrypt:** Ensures secure student authentication via Matric Number and Gmail. Password hashing (scrypt) is used to protect user credentials, filling the security gap found in social media based systems.

#### 2.3.2 Graphical User Interface (GUI) Frameworks
- **React & Tailwind CSS:** Provides a premium, responsive interface that works on both mobile and desktop.
- **Lucide React & Radix UI:** Used for micro-animations and accessible UI components (Tabs, Dialogs, Toasts).

#### 2.3.3 Data Management and Visualization
- **Drizzle ORM & MemStorage:** Facilitates efficient retrieval and filtering of item data by category and location (ELT, Buft LT, etc.), ensuring "matched data" is rendered instantly to the user.

### 2.4 Gap Your Project Fills
FindIt fills the critical gap between disorganized social media posts and inaccessible physical offices by providing:
1. **Verified Access:** Security via Matric Number ensures only community members interact with the system.
2. **Direct Interaction:** The "Report" button triggers real-time notifications between finders and owners.
3. **Resolution Lifecycle:** A structured "Claimed" status and "Claim Requests" dashboard archive, ensuring items are returned to rightful owners with documented holder information.
