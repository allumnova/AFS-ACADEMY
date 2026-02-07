# AFS Academy - Feature Gap Analysis

This document compares the current implementation against the proposal "AFS Academy – Complete System Feature Flow".

## 1. Role-Based Access Control (RBAC)
- **Status**: Mostly Implemented.
- **Identified Gaps**:
    - [ ] **Super Admin Dashboard**: Currently, many Super Admin functions seem to be missing or merged into the standard Admin panel without specific role distinction in the UI.
    - [ ] **Permission Granularity**: Role permissions are defined in code, but a UI for a Super Admin to manage these roles is missing.

---

## 2. Student Dashboard
- **Status**: Partially Implemented.
- **Identified Gaps**:
    - [x] **My Courses**: Implemented.
    - [ ] **Live Class Flow**: The join session flow and auto-attendance marking need deeper verification.
    - [ ] **Attendance Summary**: Course-wise attendance views for students are missing or basic.
    - [ ] **Recorded Lectures**: Tracking watch progress is implemented in backend, but frontend "Resume" button and % bars need verification.
    - [ ] **Feedback/Reviews**: Student cannot yet see an "approval pending" state for their reviews.

---

## 3. Faculty Dashboard
- **Status**: Basic Implementation.
- **Identified Gaps**:
    - [ ] **Student List**: Faculty cannot currently view a list of students specifically enrolled in *their* assigned courses.
    - [ ] **Syllabus Suggestions**: No mechanism for faculty to suggest changes to the admin.
    - [ ] **Feedback View**: Faculty cannot view the 1-5 star ratings or comments from students on their specific courses.
    - [ ] **Attendance Override**: UI for manual attendance override is missing.

---

## 4. Admin Dashboard (CORE)
- **Status**: Partially Implemented.
- **MAJOR GAP: BATCH MANAGEMENT**
    - [ ] No `Batches` table in database.
    - [ ] No frontend UI for creating batches or assigning students to them.
- **Academic Gaps**:
    - [ ] **Batch-wise Attendance**: Dependent on Batch management.
- **Finance Gaps**:
    - [ ] **Payment Analytics**: No charts or trends for revenue in the UI.
    - [ ] **Refund Control**: No manual refund trigger in the admin panel.
- **Engagement Gaps**:
    - [ ] **Feedback Moderation**: No UI to approve/hide reviews.
    - [ ] **Targeted Notifications**: No UI to send a message to a specific batch or student via App/Email/SMS.
- **Reports**:
    - [ ] **Export Data**: Exporting students/payments to Excel/PDF is missing.
    - [ ] **Progress Reports**: Visualizing student progress across the academy.

---

## 5. Super Admin Dashboard (SYSTEM)
- **Status**: Mostly Missing.
- **Identified Gaps**:
    - [ ] **Platform Settings**: Branding, themes, and white-labeling controls.
    - [ ] **Payment Gateway Configuration**: UI to set API keys for Cashfree/Razorpay.
    - [ ] **Audit Trails**: Security logs for admin/faculty actions.

---

## 6. Implementation Checklist (TODO)

### phase 1: Database & Core Foundation
- [ ] Create `Batches` model and migrations.
- [ ] Add `BatchStudent` junction table.
- [ ] Update `Enrollment` to include `batchId`.

### Phase 2: Admin Operations
- [ ] Implement Batch Management UI.
- [ ] Add "Export to Excel/PDF" utility for Students/Finance.
- [ ] Create Feedback Moderation toggle.

### Phase 3: Faculty & Student UX
- [ ] Add Student list view for Faculty.
- [ ] Implement Faculty feedback view.
- [ ] Enhance Student Attendance dashboard.

### Phase 4: Super Admin & System
- [ ] Build System Settings page (Branding/API Keys).
- [ ] Implement Audit Log viewer.
