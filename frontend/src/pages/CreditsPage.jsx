import "./style.css"


const CreditsPage = () =>{
    return(
        <>
            <h1 className="creditsTitle">Hotel Group: Library Management System Credits</h1>
            <div className="creditsContainer">
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
                            Built the credits and contacts page.
                        </li>
                    </ul>
                </div>
                
            </div>
        </>
    )
}

export default CreditsPage;
