"""
Mocking examples using unittest.mock with pytest.

These examples demonstrate:
- Mocking external dependencies
- Mocking API calls
- Mocking time/dates
- Verifying mock calls
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
import requests


# Example service that makes external API calls
class UserService:
    """Service for managing users with external API."""

    def __init__(self, api_url: str):
        self.api_url = api_url

    def fetch_user(self, user_id: int) -> dict:
        """Fetch user data from external API."""
        response = requests.get(f"{self.api_url}/users/{user_id}")
        response.raise_for_status()
        return response.json()

    def create_user(self, user_data: dict) -> dict:
        """Create a new user via API."""
        response = requests.post(f"{self.api_url}/users", json=user_data)
        response.raise_for_status()
        return response.json()


class TestUserServiceMocking:
    """Tests demonstrating mocking patterns."""

    @patch('requests.get')
    def test_fetch_user_success(self, mock_get):
        """Test fetching user with mocked API response."""
        # Arrange - setup mock
        mock_response = Mock()
        mock_response.json.return_value = {
            "id": 123,
            "name": "John Doe",
            "email": "john@example.com"
        }
        mock_response.status_code = 200
        mock_get.return_value = mock_response

        service = UserService("https://api.example.com")

        # Act
        user = service.fetch_user(123)

        # Assert
        assert user["name"] == "John Doe"
        assert user["email"] == "john@example.com"
        mock_get.assert_called_once_with("https://api.example.com/users/123")

    @patch('requests.get')
    def test_fetch_user_handles_404(self, mock_get):
        """Test handling of 404 response."""
        # Arrange
        mock_get.return_value.status_code = 404
        mock_get.return_value.raise_for_status.side_effect = \
            requests.exceptions.HTTPError("404 Not Found")

        service = UserService("https://api.example.com")

        # Act & Assert
        with pytest.raises(requests.exceptions.HTTPError):
            service.fetch_user(999)

    @patch('requests.post')
    def test_create_user_success(self, mock_post):
        """Test creating user with mocked POST request."""
        # Arrange
        user_data = {"name": "Jane Doe", "email": "jane@example.com"}
        mock_response = Mock()
        mock_response.json.return_value = {
            "id": 456,
            **user_data
        }
        mock_post.return_value = mock_response

        service = UserService("https://api.example.com")

        # Act
        result = service.create_user(user_data)

        # Assert
        assert result["id"] == 456
        assert result["name"] == "Jane Doe"
        mock_post.assert_called_once_with(
            "https://api.example.com/users",
            json=user_data
        )


# Example with time-dependent logic
class SubscriptionService:
    """Service with time-dependent logic."""

    def is_expired(self, expiry_date: datetime) -> bool:
        """Check if subscription has expired."""
        return datetime.now() > expiry_date

    def days_until_expiry(self, expiry_date: datetime) -> int:
        """Calculate days until expiry."""
        delta = expiry_date - datetime.now()
        return max(0, delta.days)


class TestSubscriptionServiceTimeMocking:
    """Tests demonstrating time mocking."""

    @patch('test_mocking.datetime')
    def test_is_expired_returns_true_for_past_date(self, mock_datetime):
        """Test expiry check with mocked current time."""
        # Arrange - mock current time
        mock_datetime.now.return_value = datetime(2026, 2, 9, 12, 0)

        service = SubscriptionService()
        expiry_date = datetime(2026, 1, 1, 12, 0)  # Past date

        # Act
        result = service.is_expired(expiry_date)

        # Assert
        assert result is True

    @patch('test_mocking.datetime')
    def test_is_expired_returns_false_for_future_date(self, mock_datetime):
        """Test expiry check for future date."""
        # Arrange
        mock_datetime.now.return_value = datetime(2026, 2, 9, 12, 0)

        service = SubscriptionService()
        expiry_date = datetime(2026, 12, 31, 12, 0)  # Future date

        # Act
        result = service.is_expired(expiry_date)

        # Assert
        assert result is False

    @patch('test_mocking.datetime')
    def test_days_until_expiry_calculates_correctly(self, mock_datetime):
        """Test days calculation with mocked time."""
        # Arrange
        mock_datetime.now.return_value = datetime(2026, 2, 9, 12, 0)

        service = SubscriptionService()
        expiry_date = datetime(2026, 2, 19, 12, 0)  # 10 days from now

        # Act
        days = service.days_until_expiry(expiry_date)

        # Assert
        assert days == 10


# Example with mock object
class TestMockObject:
    """Tests demonstrating Mock objects."""

    def test_mock_with_return_value(self):
        """Test using Mock with predefined return value."""
        # Arrange
        mock_db = Mock()
        mock_db.get_user.return_value = {"id": 1, "name": "Test"}

        # Act
        user = mock_db.get_user(1)

        # Assert
        assert user["name"] == "Test"
        mock_db.get_user.assert_called_with(1)

    def test_mock_with_side_effect(self):
        """Test using Mock with side effects."""
        # Arrange
        mock_api = Mock()
        mock_api.call.side_effect = [1, 2, 3]

        # Act & Assert
        assert mock_api.call() == 1
        assert mock_api.call() == 2
        assert mock_api.call() == 3

    def test_verifying_mock_calls(self):
        """Test verifying how mock was called."""
        # Arrange
        mock_logger = Mock()

        # Act
        mock_logger.info("User logged in")
        mock_logger.error("Error occurred")

        # Assert
        assert mock_logger.info.call_count == 1
        assert mock_logger.error.call_count == 1
        mock_logger.info.assert_called_with("User logged in")
        mock_logger.error.assert_called_with("Error occurred")
