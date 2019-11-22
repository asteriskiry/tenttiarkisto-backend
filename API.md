# API description


## Files

```
GET /api/files
GET /api/files/:fileId # Searches file and redirects to S3 bucket
POST /api/files
PUT /api/files/:fileId
DELETE /api/files/:fileId

GET /api/subjects/:subjectId/courses -- Courses of the subject
```
## Subjects

```
GET /api/subjects
POST /api/subjects
PUT /api/subjects/:subjectId
DELETE /api/subjects/:subjectId

GET /api/subjects/:subjectId/courses -- Courses of the subject

```
## Courses

```
GET /api/courses
POST /api/courses
PUT /api/courses/:courseId
DELETE /api/courses/:courseId

GET /api/courses/:courseId/files -- Files of the course
```