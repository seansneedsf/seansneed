from django.shortcuts import render, redirect # redirect might be useful later
from .forms import ContactForm # Import the form
# from django.core.mail import send_mail # For actual email sending later
# from django.conf import settings # For email settings later
# from django.http import HttpResponse # No longer needed if all views use render

# Create your views here.
def home_view(request):
    # context = {} # You can add context data here if needed later
    return render(request, 'main_app/home.html')

def about_view(request):
    # context = {} # Future context
    return render(request, 'main_app/about.html')

def services_view(request):
    # context = {} # Future context
    return render(request, 'main_app/services.html')

def contact_view(request):
    message_sent = False
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # Process the form data (e.g., send an email)
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            subject = form.cleaned_data['subject']
            message = form.cleaned_data['message']

            # For now, just print to console
            print(f"Contact Form Submission:")
            print(f"Name: {name}")
            print(f"Email: {email}")
            print(f"Subject: {subject}")
            print(f"Message: {message}")
            
            # In a real application, you might send an email here:
            # send_mail(
            #     f"Message from {name}: {subject}",
            #     message,
            #     email, # from_email
            #     [settings.DEFAULT_FROM_EMAIL], # to_list
            # )

            message_sent = True 
            # To show an empty form after successful submission and display the "thank you" message,
            # we pass a new form instance.
            form = ContactForm() 
    else:
        form = ContactForm()
    
    return render(request, 'main_app/contact.html', {'form': form, 'message_sent': message_sent})
