---
title: task-management
type: project
classification: PORTFOLIO_PROJECT
last_commit: 852a73c3a47d67e1f2de1adf888ccfc2416968c4
---

# Task Management REST API

A role-based Task Management REST API built with Django REST Framework and PostgreSQL, featuring JWT authentication, role-based access control (RBAC), automatic activity logging using Django signals with Python `contextvars`, soft deletion for tasks, and automated API testing.

## Summary

- **Repository Name**: task-management
- **Author / Owner**: ravindidhananjana VERIFIED (Source: URL)
- **Primary Technology Stack**: Python 3.11, Django 5.2, Django REST Framework 3.18, PostgreSQL, SimpleJWT, `django-filter` VERIFIED (Source: README.md, requirements.txt)
- **Key Features**: Custom User model with Admin/Member roles, JWT authentication with token blacklisting logout, soft delete for tasks, Django signal-driven activity logging with context tracking, filtering, ordering, pagination, and automated test suite. VERIFIED (Source: README.md, project files)

---

## Technical Stack & Dependencies

- **Language**: Python 3.11 VERIFIED (Source: README.md)
- **Framework**: Django 5.2.17, Django REST Framework 3.18.0 VERIFIED (Source: requirements.txt)
- **Database**: PostgreSQL (connected via `psycopg` 3.3.4) VERIFIED (Source: README.md, requirements.txt, config/settings.py)
- **Authentication**: `rest_framework_simplejwt` 5.5.1, `PyJWT` 2.13.0 VERIFIED (Source: requirements.txt, config/settings.py)
- **Query Filtering**: `django-filter` 26.1 VERIFIED (Source: requirements.txt, config/settings.py)
- **Environment Management**: `python-dotenv` 1.2.2 VERIFIED (Source: requirements.txt, config/settings.py)

---

## Project Architecture & Implementation Details

### 1. Data Models (`accounts`, `projects`, `activity_logs`)

- **Custom User Model (`accounts/models.py`)**:
  - Extends `AbstractUser` with a custom `role` field using `TextChoices` (`ADMIN` or `MEMBER`). Defaults to `MEMBER`. VERIFIED (Source: accounts/models.py)
- **Project Model (`projects/models.py`)**:
  - Contains `name`, `description`, `owner` (ForeignKey to `User`), and `created_at`. VERIFIED (Source: projects/models.py)
- **Task Model (`projects/models.py`)**:
  - Contains `title`, `description`, `status` (`TODO`, `IN_PROGRESS`, `DONE`), `priority` (`LOW`, `MEDIUM`, `HIGH`), `assigned_to` (ForeignKey to `User`), `project` (ForeignKey to `Project`), `due_date`, `is_deleted` (Boolean soft-delete flag, defaults to `False`), `created_at`, and `updated_at`. VERIFIED (Source: projects/models.py)
- **ActivityLog Model (`activity_logs/models.py`)**:
  - Tracks user activity with `user` (ForeignKey to `User`), `action` (`CREATE`, `UPDATE`, `DELETE`), `model_name` (CharField), `object_id` (PositiveBigIntegerField), and `timestamp`. VERIFIED (Source: activity_logs/models.py)

### 2. Context Tracking for Django Signals (`core/activity_context.py` & `activity_logs/signals.py`)

- **Problem Addressed**: Django database signals (`post_save`, `post_delete`) do not natively have access to the current HTTP `request.user`. INFERRED
- **Implementation**:
  - Uses Python's native `contextvars` module (`activity_context.py`) to manage a thread/task-local `_current_user` variable. VERIFIED (Source: core/activity_context.py)
  - ViewSets (`ProjectViewSet`, `TaskViewSet`) invoke `set_current_user(self.request.user)` inside `perform_create`, `perform_update`, and `perform_destroy` methods before performing model persistence, resetting the token in a `finally` block. VERIFIED (Source: projects/views.py)
  - Django signal receivers (`log_project_save`, `log_project_delete`, `log_task_save`) call `get_current_user()` to record the acting user in `ActivityLog`. VERIFIED (Source: activity_logs/signals.py)

### 3. Role-Based Access Control (RBAC) & Permissions (`core/permissions.py`)

- **`IsAdminOrTaskMember`**:
  - `ADMIN` role: Full permissions for all HTTP methods (CREATE, READ, UPDATE, DELETE). VERIFIED (Source: core/permissions.py)
  - `MEMBER` role:
    - Can list and create tasks (POST). When a Member creates a task, it is automatically assigned to them via `perform_create`. VERIFIED (Source: core/permissions.py, projects/views.py)
    - Can update (PUT/PATCH) tasks only if `assigned_to == request.user`. VERIFIED (Source: core/permissions.py)
    - Cannot update tasks assigned to other users. VERIFIED (Source: core/permissions.py, projects/tests.py)
    - Cannot delete tasks (DELETE is strictly forbidden for Members). VERIFIED (Source: core/permissions.py)
- **`IsAdminOrReadOnly`**:
  - Admin users have full CRUD access over `Project` resources.
  - Member users have read-only (`GET`, `HEAD`, `OPTIONS`) access to projects. VERIFIED (Source: core/permissions.py)

### 4. Soft Delete Pattern (`projects/views.py`)

- When a `DELETE` request is sent to `TaskViewSet`:
  - `perform_destroy` flags the instance attribute `instance._activity_delete = True` and sets `instance.is_deleted = True`, persisting the change with `save(update_fields=["is_deleted"])` rather than invoking SQL `DELETE`. VERIFIED (Source: projects/views.py)
  - Signal receiver `log_task_save` checks `getattr(instance, "_activity_delete", False)` to log a `DELETE` action in `ActivityLog`. VERIFIED (Source: activity_logs/signals.py)
  - Standard queries exclude soft-deleted items because `TaskViewSet` overrides `queryset = Task.objects.filter(is_deleted=False)`. VERIFIED (Source: projects/views.py)

### 5. Filtering, Ordering, Search, & Pagination (`projects/views.py`, `config/settings.py`)

- **Pagination**: Default page size of 10 items using `PageNumberPagination`. VERIFIED (Source: config/settings.py)
- **Filtering**: `DjangoFilterBackend` supports filtering tasks by `status`, `priority`, `assigned_to`, and `project`. VERIFIED (Source: projects/views.py)
- **Search**: `SearchFilter` enables text search across `title` and `description`. VERIFIED (Source: projects/views.py)
- **Ordering**: `OrderingFilter` allows sorting by `created_at`, `updated_at`, `due_date`, `priority`, `status`, and `title`. Default ordering is `-created_at`. VERIFIED (Source: projects/views.py)

---

## API Endpoints Summary

| Method | Endpoint | Description | Permission Required | Source |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/login/` | Obtain JWT access & refresh tokens | AllowAny | VERIFIED (Source: config/urls.py) |
| `POST` | `/api/v1/auth/refresh/` | Refresh JWT access token | AllowAny | VERIFIED (Source: config/urls.py) |
| `POST` | `/api/v1/auth/logout/` | Blacklist refresh token & logout | IsAuthenticated | VERIFIED (Source: core/urls.py, core/views.py) |
| `GET` / `POST` | `/api/v1/projects/` | List or create projects | IsAdminOrReadOnly | VERIFIED (Source: projects/urls.py, projects/views.py) |
| `GET` / `PUT` / `PATCH` / `DELETE` | `/api/v1/projects/{id}/` | Detail endpoints for projects | IsAdminOrReadOnly | VERIFIED (Source: projects/urls.py, projects/views.py) |
| `GET` / `POST` | `/api/v1/tasks/` | List or create tasks | IsAdminOrTaskMember | VERIFIED (Source: projects/urls.py, projects/views.py) |
| `GET` / `PUT` / `PATCH` / `DELETE` | `/api/v1/tasks/{id}/` | Detail endpoints for tasks (DELETE is soft delete) | IsAdminOrTaskMember | VERIFIED (Source: projects/urls.py, projects/views.py) |
| `GET` | `/api/v1/activity-logs/` | List activity logs (Admins see all; Members see own) | IsAuthenticated | VERIFIED (Source: projects/urls.py, activity_logs/views.py) |

---

## Testing & Quality Assurance

- **Test Suite**: Located in `projects/tests.py` using DRF `APITestCase`. VERIFIED (Source: projects/tests.py)
- **Total Test Cases**: 7 automated tests. VERIFIED (Source: README.md, projects/tests.py)
- **Verified Scenarios**:
  1. `test_login`: Verifies JWT login returns access and refresh tokens. VERIFIED (Source: projects/tests.py)
  2. `test_member_can_create_task`: Confirms member task creation automatically sets `assigned_to` to the calling member. VERIFIED (Source: projects/tests.py)
  3. `test_member_cannot_update_unassigned_task`: Verifies HTTP 403 Forbidden when a member attempts to modify another user's task. VERIFIED (Source: projects/tests.py)
  4. `test_task_delete_is_soft_delete`: Asserts soft-delete sets `is_deleted = True` and removes the item from API list views. VERIFIED (Source: projects/tests.py)
  5. `test_activity_log_created_for_task_creation`: Ensures `ActivityLog` creation entry is saved with appropriate user reference. VERIFIED (Source: projects/tests.py)
  6. `test_activity_log_created_for_task_update`: Verifies `ActivityLog` update entry creation. VERIFIED (Source: projects/tests.py)
  7. `test_activity_log_created_for_task_delete`: Verifies `ActivityLog` delete entry creation upon soft deletion. VERIFIED (Source: projects/tests.py)

---

## Author Contributions

- **Repository Owner**: Ravindi Dhananjana (`ravindidhananjana`) VERIFIED (Source: README.md, URL)
- **Core Implementation**:
  - Designed custom user role system (`ADMIN` vs `MEMBER`). VERIFIED (Source: accounts/models.py)
  - Implemented decoupling mechanism for Django signals using Python `contextvars` context manager. VERIFIED (Source: core/activity_context.py)
  - Developed custom DRF granular permission classes (`IsAdminOrTaskMember`, `IsAdminOrReadOnly`). VERIFIED (Source: core/permissions.py)
  - Built task soft deletion workflow integrated with activity logging. VERIFIED (Source: projects/views.py, activity_logs/signals.py)
  - Authored automated integration test suite covering RBAC, soft deletion, and signal logging. VERIFIED (Source: projects/tests.py)
