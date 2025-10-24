# BackupVault Testing Checklist
**First Test Run After Deployment**

---

## ✅ Pre-Deployment Tests (Local)

### Environment Setup
- [ ] `.env.local` file created with all required variables
- [ ] ENCRYPTION_KEY is 32 characters
- [ ] Supabase URL and keys are correct
- [ ] Run `npm install` successfully
- [ ] Run `npm run build` without errors

### Local Testing
```bash
cd backupvault
npm run dev
```

- [ ] App starts on http://localhost:3000
- [ ] Landing page loads correctly
- [ ] No console errors
- [ ] All navigation links work

---

## ✅ Post-Deployment Tests (Production)

### Test 1: Landing Page
- [ ] Visit production URL
- [ ] Page loads within 3 seconds
- [ ] Hero section displays correctly
- [ ] Features section shows 6 features
- [ ] Pricing section shows 3 plans
- [ ] Footer displays correctly
- [ ] No 404 errors in network tab

### Test 2: User Registration

**Steps:**
1. Click "Start Free Trial" or navigate to `/signup`
2. Enter full name: "Test User"
3. Enter email: your-email@example.com
4. Enter weak password: "password123"

**Expected:**
- [ ] Password strength shows "Weak"
- [ ] Signup button should work but password validation should fail
- [ ] See error message about password strength

**Steps:**
5. Enter strong password: "MyStr0ng!Pass@2024"

**Expected:**
- [ ] Password strength shows "Strong" or "Good"
- [ ] Signup succeeds
- [ ] Redirected to /dashboard
- [ ] Email verification sent

### Test 3: Email Verification

**Steps:**
1. Check your email inbox
2. Find verification email from Supabase
3. Click verification link

**Expected:**
- [ ] Link redirects to app
- [ ] Email verified successfully
- [ ] Can log in with verified email

### Test 4: Login

**Steps:**
1. Log out if logged in
2. Go to `/login`
3. Enter registered email and password
4. Click "Sign In"

**Expected:**
- [ ] Login succeeds
- [ ] Redirected to /dashboard
- [ ] No errors in console
- [ ] User session persists on page reload

### Test 5: Dashboard

**Steps:**
1. Navigate through all dashboard pages

**Expected:**
- [ ] **Dashboard**: Shows 4 stat cards (all zeros for new user)
- [ ] **Dashboard**: Shows quick actions
- [ ] **Dashboard**: Shows getting started guide
- [ ] **Dashboard**: Shows current plan badge (FREE)
- [ ] **Workspaces**: Empty state message displayed
- [ ] **Storage**: Empty state message displayed
- [ ] **Backups**: Empty state message displayed
- [ ] **Settings**: Shows user email and profile form

### Test 6: Profile Update

**Steps:**
1. Go to Settings page
2. Update full name to "Updated Test User"
3. Click "Save Changes"

**Expected:**
- [ ] Success toast notification appears
- [ ] Name updated in database
- [ ] No errors

### Test 7: Sign Out

**Steps:**
1. Click "Sign Out" in sidebar

**Expected:**
- [ ] User logged out
- [ ] Redirected to homepage
- [ ] Session cleared
- [ ] Can't access /dashboard without login

---

## ✅ Database Verification

### Check Supabase Tables

**Steps:**
1. Go to Supabase dashboard
2. Navigate to Table Editor
3. Check each table

**Expected:**
- [ ] **profiles** table: Has 1 row with your user data
  - [ ] id matches auth user id
  - [ ] email is correct
  - [ ] subscription_plan is "free"
  - [ ] subscription_status is "active"
  - [ ] created_at timestamp is present

- [ ] **workspace_connections** table: Empty (no connections yet)
- [ ] **storage_connections** table: Empty (no connections yet)
- [ ] **backup_configs** table: Empty (no configs yet)
- [ ] **backups** table: Empty (no backups yet)
- [ ] **usage_tracking** table: Empty (no usage yet)

### Check Auth Users

**Steps:**
1. Go to Authentication → Users

**Expected:**
- [ ] Your user appears in the list
- [ ] Email is confirmed (green checkmark)
- [ ] Last sign in timestamp is recent

---

## ✅ Security Tests

### Test 1: Unauthorized Access

**Steps:**
1. Open incognito/private browser window
2. Try to access `https://your-app.vercel.app/dashboard`

**Expected:**
- [ ] Redirected to `/login`
- [ ] Cannot see dashboard content

### Test 2: Password Strength

**Steps:**
1. Try creating account with various passwords

**Passwords to test:**
- [ ] "pass123" → Should fail (too short)
- [ ] "passwordpassword" → Should fail (no complexity)
- [ ] "Password123" → Should warn (no special chars)
- [ ] "P@ssw0rd!2024" → Should succeed (strong)

### Test 3: Input Validation

**Steps:**
1. Try submitting forms with:
   - Empty fields
   - Invalid email formats
   - Special characters in names

**Expected:**
- [ ] Proper validation errors shown
- [ ] No crashes or 500 errors
- [ ] Form doesn't submit with invalid data

---

## ✅ Performance Tests

### Page Load Times

**Expected (on good connection):**
- [ ] Landing page: < 2 seconds
- [ ] Login page: < 1 second
- [ ] Dashboard: < 2 seconds
- [ ] Settings page: < 1 second

### Network Requests

**Steps:**
1. Open browser DevTools → Network tab
2. Reload dashboard

**Expected:**
- [ ] < 50 requests total
- [ ] No failed requests (except expected 4xx)
- [ ] No duplicate requests
- [ ] API calls use proper auth headers

---

## ✅ Error Handling Tests

### Test 1: Wrong Credentials

**Steps:**
1. Try logging in with wrong password

**Expected:**
- [ ] Clear error message
- [ ] No sensitive data leaked
- [ ] Can try again

### Test 2: Network Offline

**Steps:**
1. Turn off internet
2. Try to perform actions

**Expected:**
- [ ] Graceful error messages
- [ ] App doesn't crash
- [ ] Retry mechanism works when back online

### Test 3: Expired Session

**Steps:**
1. Log in
2. Wait for session to expire (or manually clear in Supabase)
3. Try to perform action

**Expected:**
- [ ] Redirected to login
- [ ] Session refreshed if possible
- [ ] No data loss

---

## ✅ Mobile Responsiveness

### Test on Mobile Device or Responsive Mode

**Breakpoints to test:**
- [ ] Mobile: 375px width
- [ ] Tablet: 768px width
- [ ] Desktop: 1440px width

**Expected:**
- [ ] Navigation works on all sizes
- [ ] Forms are usable on mobile
- [ ] Sidebar collapses on mobile
- [ ] Text is readable
- [ ] Buttons are tappable (min 44px)
- [ ] No horizontal scroll

---

## ✅ Browser Compatibility

**Browsers to test:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Expected:**
- [ ] All features work in all browsers
- [ ] No console errors
- [ ] Consistent appearance

---

## ⚠️ Known Limitations (First Test)

Since API integrations aren't configured yet:
- ❌ Can't connect Notion workspaces
- ❌ Can't connect Trello boards
- ❌ Can't connect cloud storage
- ❌ Can't create backups
- ❌ Payment processing not active

These will be testable once you configure the respective API keys.

---

## 🐛 Issue Tracking

If you encounter issues, document them here:

### Issue Template
```
**Issue:**
**Steps to Reproduce:**
**Expected:**
**Actual:**
**Error Message:**
**Browser:**
**Screenshot:**
```

---

## ✅ Deployment Checklist Summary

- [ ] All security fixes applied
- [ ] Encryption working correctly
- [ ] User registration works
- [ ] Email verification works
- [ ] Login/logout works
- [ ] Dashboard loads
- [ ] Database tables created
- [ ] RLS policies active
- [ ] Security headers present
- [ ] No sensitive data in logs
- [ ] Password validation works
- [ ] Mobile responsive
- [ ] Performance acceptable

---

## 🎉 Success Criteria

Your deployment is successful if:
1. ✅ Users can sign up and log in
2. ✅ Dashboard is accessible and functional
3. ✅ Database is properly configured
4. ✅ Security headers are active
5. ✅ No critical errors in logs
6. ✅ Site is fast and responsive

---

## Next Steps After Testing

1. Document any issues found
2. Fix critical bugs before adding features
3. Configure API integrations (Notion, Trello, storage)
4. Test backup functionality
5. Configure payment processing
6. Invite beta testers
7. Monitor logs and usage
8. Collect feedback
9. Iterate and improve

---

**Happy Testing!** 🧪
