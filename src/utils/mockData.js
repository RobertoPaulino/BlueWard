// Mock data for BlueWard application

// Mock users
export const mockUsers = {
  residents: [
    {
      id: 1,
      username: 'john_resident',
      fullName: 'John Smith',
      type: 'resident',
      residence: 'A101',
      friends: [3, 4, 5],
      invites: [1, 2],
    },
    {
      id: 2,
      username: 'maria_resident',
      fullName: 'Maria Rodriguez',
      type: 'resident',
      residence: 'B205',
      friends: [3, 6],
      invites: [3],
    },
  ],
  guests: [
    {
      id: 3,
      username: 'bob_guest',
      fullName: 'Bob Johnson',
      type: 'guest',
      friends: [1, 2],
    },
    {
      id: 4,
      username: 'sarah_guest',
      fullName: 'Sarah Wilson',
      type: 'guest',
      friends: [1],
    },
    {
      id: 5,
      username: 'dave_guest',
      fullName: 'Dave Miller',
      type: 'guest',
      friends: [1],
    },
    {
      id: 6,
      username: 'lisa_guest',
      fullName: 'Lisa Anderson',
      type: 'guest',
      friends: [2],
    },
  ],
  security: [
    {
      id: 7,
      username: 'guard_main',
      fullName: 'Michael Guard',
      type: 'security',
    },
  ],
  admin: [
    {
      id: 8,
      username: 'admin_super',
      fullName: 'Admin User',
      type: 'admin',
    },
  ],
};

// Mock invites
export const mockInvites = [
  {
    id: 1,
    createdBy: 1, // John
    guestId: 3, // Bob
    validDays: 3,
    multiUse: true,
    code: 'JB12345',
    status: 'active',
    createdAt: '2023-04-01T10:00:00Z',
    expiresAt: '2023-04-04T10:00:00Z',
    usageCount: 2,
  },
  {
    id: 2,
    createdBy: 1, // John
    guestId: 4, // Sarah
    validDays: 1,
    multiUse: false,
    code: 'JS67890',
    status: 'active',
    createdAt: '2023-04-02T14:00:00Z',
    expiresAt: '2023-04-03T14:00:00Z',
    usageCount: 0,
  },
  {
    id: 3,
    createdBy: 2, // Maria
    guestId: 6, // Lisa
    validDays: 7,
    multiUse: true,
    code: 'ML24680',
    status: 'active',
    createdAt: '2023-04-01T09:00:00Z',
    expiresAt: '2023-04-08T09:00:00Z',
    usageCount: 1,
  },
];

// Mock check-ins
export const mockCheckIns = [
  {
    id: 1,
    userId: 3, // Bob
    inviteId: 1,
    timestamp: '2023-04-01T14:30:00Z',
    type: 'check-in',
  },
  {
    id: 2,
    userId: 3, // Bob
    inviteId: 1,
    timestamp: '2023-04-01T19:45:00Z',
    type: 'check-out',
  },
  {
    id: 3,
    userId: 3, // Bob
    inviteId: 1,
    timestamp: '2023-04-02T11:15:00Z',
    type: 'check-in',
  },
  {
    id: 4,
    userId: 6, // Lisa
    inviteId: 3,
    timestamp: '2023-04-02T16:20:00Z',
    type: 'check-in',
  },
  {
    id: 5,
    userId: 6, // Lisa
    inviteId: 3,
    timestamp: '2023-04-02T20:05:00Z',
    type: 'check-out',
  },
];

// Mock notifications
export const mockNotifications = [
  {
    id: 1,
    userId: 1, // John
    relatedUserId: 3, // Bob
    type: 'check-in',
    timestamp: '2023-04-01T14:30:00Z',
    read: true,
  },
  {
    id: 2,
    userId: 1, // John
    relatedUserId: 3, // Bob
    type: 'check-out',
    timestamp: '2023-04-01T19:45:00Z',
    read: true,
  },
  {
    id: 3,
    userId: 7, // Guard
    relatedUserId: 3, // Bob
    type: 'entry-request',
    timestamp: '2023-04-02T11:10:00Z',
    read: true,
  },
  {
    id: 4,
    userId: 2, // Maria
    relatedUserId: 6, // Lisa
    type: 'check-in',
    timestamp: '2023-04-02T16:20:00Z',
    read: false,
  },
];

// Mock VIP invites
export const mockVIPInvites = [
  {
    id: 101,
    code: 'VIP1234',
    fullName: 'James Williams',
    email: 'james.williams@example.com',
    phone: '+1 555-123-4567',
    createdBy: 8, // Admin
    createdAt: '2023-04-01T09:00:00Z',
    status: 'active',
    isIndefinite: true,
    expiresAt: null,
  },
  {
    id: 102,
    code: 'VIP5678',
    fullName: 'Emily Parker',
    email: 'emily.parker@example.com',
    phone: '+1 555-234-5678',
    createdBy: 8, // Admin
    createdAt: '2023-04-02T10:30:00Z',
    status: 'active',
    isIndefinite: false,
    expiresAt: '2023-05-02T10:30:00Z',
    validDays: 30,
  },
  {
    id: 103,
    code: 'VIP9012',
    fullName: 'Michael Davidson',
    email: 'michael.davidson@example.com',
    phone: '+1 555-345-6789',
    createdBy: 8, // Admin
    createdAt: '2023-04-05T14:15:00Z',
    status: 'active',
    isIndefinite: false,
    expiresAt: '2023-06-05T14:15:00Z',
    validDays: 60,
  },
  {
    id: 104,
    code: 'VIP3456',
    fullName: 'Sofia Martinez',
    email: 'sofia.martinez@example.com',
    phone: '+1 555-456-7890',
    createdBy: 8, // Admin
    createdAt: '2023-03-15T11:45:00Z',
    status: 'disabled',
    isIndefinite: true,
    expiresAt: null,
  },
]; 