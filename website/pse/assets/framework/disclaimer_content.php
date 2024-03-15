<p>
<b> Introduction: </b>
</br>
My name is Niels Zwemmer, masterstudent Software Engineering at the UvA and TA for the course Project Software Engineering (PSE) 2022/2023. 
Your help will contribute to me finishing the Master's programme, for which I am very grateful! The following part is divided in sections, please take some time to read this information.
</br></br>
<b> The Goal: </b>
</br>
For my thesis, I have setup this platform: FeedbackDiary. It will be used throughout the PSE course. 
With it, I aim to get student feedback more quickly, honestly and efficiently. As a TA for this course, I will try to process this feedback immediately for the remainder of the course by discussing my findings during staff meetings.
Ideally I gather this feedback both implicitely and explicitely. This means you as a user are not required (but are allowed) to provide direct feedback.
Instead, this platform uses both manual feedback extraction from your submissions by me, as well as through the use of several A.I. sentiment analysis models. These models work best if the submitted information
is in the English language, but Dutch is supported (to some extent). I hope you will find this platform useful and that it serves its purpose to more quickly and efficiently improve the course!
</br></br>
<b> Anonymity: </b>
</br>
Data collection is performed completely anonymously. All PSE students receive a general token, which can be used to create a personal token and password afterwards. THIS TOKEN IS NOT TO BE SHARED WITH PEOPLE OUTSIDE THE PSE COURSE.
Students are asked to keep this personal token and password safe, as they are not recoverable after creation. The use for these personal tokens is to perform research if the overall sentiment about the course improves as it progresses.
In case a student does forget their credentials, they are free to create a new account. Their submissions will thereafter be treated as originating from a different student however.
</br></br>
<b> Processing of submissions: </b>
</br>
Any sentiment and feedback generated from your submissions might be kept for course improvement beyond the timespan of my thesis. Your actual submissions, however, will be deleted upon completion of my thesis.
SUBMISSIONS CAN NOT BE CHANGED AFTER SUBMISSION. This is by design, since changing the submissions afterwards could influence the collection of feedback in a negative way. 
You will have 30 minutes after logging in to submit your entries; one positive experience for that day, one negative experience and a general remark. Students are asked kindly to provide the proper type
of information in the proper textfield. This information is used to determine the accuracy of the A.I. models used by comparing actual message type with determined sentiment type (positive, negative, neutral).
</br></br>
<b> Location of data (and its processing): </b>
</br>
The server is hosted by myself, which is compliant with GDPR law. In principle, no personally identifiable information is stored for any of the students.
The only exception would be if a student disregards the warning about sending their own (or someone else's) personally identifiable information. STUDENTS ARE NOT ALLOWED TO SEND PERSONALLY IDENTIFIABLE INFORMATION ABOUT THEMSELVES OR SOMEONE ELSE.
If during manual processing of submissions any personally identifiable data is discovered, the message is immediately removed from the server. The A.I. models used for sentiment analysis are pre-trained and downloaded to my local device, which means your submissions are not shared with any third party.
Any student or teacher names that are sent in for the server are, to the best of my ability, removed from the message. This includes names that are slightly misspelled.
</br></br>
<b> Security: </b>
</br>
This server uses the HTTPS protocol for all traffic back and forth with the client (that's you!). A valid SSL certificate is in place to ensure the encryption of traffic is sufficient.
You supply a password. It is of course highly recommended not to re-use your password for any other service. To the best of my ability, I have ensured your password is encrypted and hashed according to the newest standards.
Any time communcation with the database takes place, I have used prepared statements (PDO) in the code. This mitigates many security weaknesses. I have made sure to have a minimal amount of communication to the database.
</br></br>
<b> Contact: </b>
</br>
If you have any further questions or suggestions/bugreports, please contact me through the links in the footer.
<br><br><br>
</p>