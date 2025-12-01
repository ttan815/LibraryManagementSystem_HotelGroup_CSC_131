import "./style.css"

const CreditsPage = () => {
    return(
        <>
            <h1 className="creditsTitle">Hotel Group: Library Management System Credits</h1>
            <div className="creditsContainer">

                <div className="creditsPersonalContainer">
                    <img src="src/images/credits_Simran.jpg"></img>
                    <h1>Simran Sandhu</h1>
                    <h2>Role: Project Manager</h2>
                    <h2>Accomplishments:</h2>
                    <ul className="creditsUnorderedList">
                        <li>
                            Managed meetings, weekly reports, created Jira ticket board, scheduled and established consistent team communication, documentation compilation
                        </li>
                        <li>
                            Highlighted priorities, deadline feasability, evaluated team progress, acces blockers, asked for team feedback
                        </li>
                        <li>
                            Participated in Software specification and development, validation, and evolution
                        </li>
                    </ul>
                </div>

                <div className="creditsPersonalContainer">
                    <img src=""></img>
                    <h1>Thomas Williams</h1>
                    <h2>Role: Quality Control</h2>
                    <h2>Accomplishments:</h2>
                    <ul className="creditsUnorderedList">
                        <li>
                            Created a framework for our project report by organoziing information about our approach to the software process, the requireemnts we had identified, and the tools, IDEs, and other resources necessary for developing and executing our software product
                        </li>
                        <li>
                            Evaluated and expatiated on elements of system models.
                        </li>
                        <li>
                            Participated in Software specification and development, validation, and evolution
                        </li>
                    </ul>
                </div>

                <div className="creditsPersonalContainer">
                    <img src="src/images/credits_Wyatt.jpg"></img>
                    <h1>Wyatt Walker</h1>
                    <h2>Role: Quality Control</h2>
                    <h2>Accomplishments:</h2>
                    <ul className="creditsUnorderedList">
                        <li>
                            Developed test cases for unit/component, system, and acceptance testing.
                        </li>
                        <li>
                            Ensured that the software product met all the requirements.
                        </li>
                    </ul>
                </div>
                
                <div className="creditsPersonalContainer">
                    <img src="src/images/credits_TonyTan.jpg"></img>
                    <h1>Tony Tan</h1>
                    <h2>Role: Programmer</h2>
                    <h2>Accomplishments:</h2>
                    <ul className="creditsUnorderedList">
                        <li>
                            Created the loans page for admin, with add/modify/delete capabilities for reservations, loans, and overdue fees
                        </li>
                        <li>
                            Implemented the book search feature which allows for wishlisting for individual users.
                        </li>
                        <li>
                            Made a book form for admins that allows for add/modify/delete capabilities for books that will be displayed in the book search.
                        </li>
                        <li>
                            Engineered the user login and registration form, alongside the add/modify/delete capabilities of users for admins.
                        </li>
                        <li>
                            Built the credits, contact page and functionality, membership page and functionality.
                        </li>
                        <li>
                            Helped in testing the project, finding issues and bringing it up to the team to get it resolved, adjusting CSS issues and patching small bugs found when doing quality control.
                        </li>
                        <li>
                            Participated in Software specification, development. validation, and evolution.
                        </li>
                    </ul>
                </div>
                
                <div className="creditsPersonalContainer">
                    <img src="src/images/credits_Michael.jpg"></img>
                    <h1>Michael Saldana</h1>
                    <h2>Role: Programmer</h2>
                    <h2>Accomplishments:</h2>
                    <ul className="creditsUnorderedList">
                        <li>
                            Developed the core application architecture including AppContext and AuthContext for global state management
                        </li>
                        <li>
                            Implemented the centralized API service layer with automatic token injection and error handling
                        </li>
                        <li>
                            Created the layout system including Navbar, Footer, and BasePage components for consistent UI
                        </li>
                        <li>
                            Built the smart notification system with real-time alerts and priority-based sorting
                        </li>
                        <li>
                            Engineered the reservation form modal with comprehensive validation and error handling
                        </li>
                        <li>
                            Developed multiple page components including HomePage, UserPage, AdminPage, and AuthPage
                        </li>
                        <li>
                            Implemented role-based access control and secure authentication flow
                        </li>
                        <li>
                            Created the auto-refresh system for real-time data synchronization across components
                        </li>
                        <li>
                            Participated in Software specification, development. validation, and evolution.
                        </li>
                    </ul>
                </div>
                
                <div className="creditsPersonalContainer">
                    <img src=""></img>
                    <h1>Arnav Surve</h1>
                    <h2>Role: Quality Control</h2>
                    <h2>Accomplishments:</h2>
                    <ul className="creditsUnorderedList">
                        <li>
                            Developed REST API endpoints and database schema, testing CRUD operations, and coordinating backend integrationw ith frontend React components
                        </li>
                        <li>
                            Participated in Software specification and development.
                        </li>
                    </ul>
                </div>

                <div className="creditsPersonalContainer">
                    <img src=""></img>
                    <h1>Abdul Subhan</h1>
                    <h2>Role: Designer</h2>
                    <h2>Accomplishments:</h2>
                    <ul className="creditsUnorderedList">
                        <li>
                            Created the Use-Case and Class Diagrams for the Library Management System
                        </li>
                        <li>
                            Made the Algorithmic Design Pseudocode
                        </li>
                        <li>
                            Participated in Software specification and development, validation, and evolution.
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default CreditsPage;
