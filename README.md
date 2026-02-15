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

