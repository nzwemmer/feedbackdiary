# FeedbackDiary
Welcome to the FeedbackDiary Git repository.
This repository contains the code created by Niels Zwemmer for the Master Software Engineering thesis on the same subject.

FeedbackDiary is the novel approach to collecting and processing both explicit and implicit student feedback. It does this through the application of Sentiment Analysis and automated Summarization.
It consists of two parts: 

### The Diary Dashboard (website folder in the project) 
Performs the collection of student submissions through a simple UI.

## Running the dashboard
The website uses static files only, which means compilation is not necessary. In addition, the only server running is apache2, which is already set to auto-start when the VM reboots.
To make any changes to the server configuration, see "Adding a course" for this dashboard below.

## Adding a course
Courses can be added to this dashboard as follows:  
- modify /assets/forms/course_select.php and add a new course to the list, using another course as an example.
- create a new database for the course. Recommended to use phpMyAdmin. Copy existing course database structure and generate a new general token using any random string generator tool;
- create a new folder for the new course;
- copy the contents from another course into this folder;
- modify the <course>/assets/framework/config.php file. Modify "course", "course_short", "programme", "programme_short" session variables;
- modify the <course>/functions/connect.php file. Modify "$dbdatabase" variable to match the newly created database;
- copy /etc/apache2/sites-enabled/feedbackdiary.conf to /etc/apache2/sites-enabled/\<course\>.conf
- modify /etc/apache2/sites-enabled/\<course\>.conf by adding /\<course\> to both entries of /var/www/html within the file;
- restart apache2: sudo systemctl restart apache2.

Your new course should now be up and running!

### The Feedback Dashboard (application folder in the project).
Processes collected student submissions from the Diary Dashboard using SA models and tools.

## Running the dashboard
### Frontend
In order to run the dashboard, first go to the /application/frontend/ folder. Inside this folder, run:

$ npm run build

This compiles the React app and places the results in the /application/build/ folder. This folder is then served using nginx.

### Backend
Second, go to the /application/backend/ folder. Inside this folder, run:

$ python3 app.py

This starts the development server for the backend. If you want to run the production server instead, run the following:

$ gunicorn -b \<server ip\>:12345 app:app

The dashboard should now be operational. For our VM, we already have established the MongoDB database and it is set to automatically start when the VM reboots.
If you want to build the project from scratch, make sure to include the MongoDB database as well. We define the structure of the MongoDB database below.

### Database
MongoDB is used for our database. We use the following structure:
- Database name: feedbackdiary
- Collections:
- - courses -> Each document contains: _id, name, token, start_date, end_date
  - teachers -> Each document contains: _id, email, password, courses, (optional)

## Adding a course
Courses can be added to this dashboard as follows:  
- create a new course in the MongoDB database, using the format of an existing course. Make sure you use the same course abbreviation as the one used for the Diary Dashboard;
- generate a random Teacher Course Token (TCT) which should be different from the general token generated for the Diary Dashboard;
- copy an existing document in the courses collection (see above). Set the data for the new course as required;
- provide the teacher with the newly generated TCT. They should now be able to register for a new account, or add it to their existing account.
- a folder with empty data is automatically created for the newly added course. Let teachers use the dashboard to generate new data as necessary.
