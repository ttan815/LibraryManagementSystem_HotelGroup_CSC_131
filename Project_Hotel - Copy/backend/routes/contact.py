from fastapi import APIRouter, HTTPException
import schemas

router = APIRouter()


# Not used, but when used with method POST, it takes parameters: name, email, phone, and message.
@router.post("/")
def submit_contact_form(contact: schemas.ContactForm):
    print(f"Contact form submission:")
    print(f"Name: {contact.name}")
    print(f"Email: {contact.email}")
    print(f"Phone: {contact.phone}")
    print(f"Message: {contact.message}")

    return {
        "message": "Contact form submitted successfully",
        "data": contact.dict()
    }
