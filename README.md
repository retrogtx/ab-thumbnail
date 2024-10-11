# YouTube Thumbnail A/B Testing App

This app allows people to A/B test their photos before publishing, focused on YouTube thumbnails. By enabling external users to vote on thumbnail options, creators can choose the most appealing thumbnail based on real audience feedback.

This is a simple A/B testing app for your photos without the hassle of sending the same pictures to a different set of friends, or posting them to different social media profiles for feedback.

## Features

- **Thumbnail Upload**: Users can upload two or more thumbnail variations for comparison.
- **Poll Generation**: Create polls with shareable public links.
- **Anonymous Voting**: Frictionless voting process for respondents.
- **Results Dashboard**: View vote percentages, total votes, and optional voter comments.
- **Sharing Capabilities**: Easy sharing of poll links and results.

## Tech Stack

- **Frontend**: Next.js with Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Supabase
- **Authentication**: NextAuth with Google OAuth

## Installation

- `npm install`
- `npm run dev`

## Usage

1. **Login**: Sign in using Google or email.
2. **Upload Thumbnails**: Use the drag-and-drop interface to upload thumbnail variations.
3. **Create Poll**: Generate a shareable poll link.
4. **Share**: Distribute the poll link across your channels.
5. **Analyze**: View results in the dashboard after the voting period.

## User Flow

1. **Creator**:
   - Login and setup
   - Upload thumbnails
   - Generate and share poll
2. **Voter**:
   - Access poll via link
   - Vote anonymously
   - Optionally leave comments // TODO
3. **Creator**:
   - Analyze results
   - Select winning thumbnail

## UI Components

- **Dashboard**: Thumbnail upload, poll generation, active polls list
- **Poll Page**: Side-by-side thumbnail display, voting interface
- **Results Page**: Vote summary charts, comments display // TODO