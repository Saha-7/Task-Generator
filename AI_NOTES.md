# AI Usage Notes

## Which LLM and Why

**LLM:** Google Gemini 2.5 Flash  
**Provider:** Google AI Studio

### Why Gemini?

1. **100% FREE** - No credit card required for API key
2. **Good Quality** - Generates structured user stories and tasks well
3. **Fast** - Responses in 10-15 seconds
4. **Easy Setup** - Simple REST API, no complex SDK needed
5. **Generous Limits** - 20 requests/minute is enough for testing

### Why Not Others?

- **Claude:** Requires credit card, costs $3-15 per million tokens
- **GPT-4:** Paid only, higher costs
- **Open Source (Llama, Mistral):** Requires self-hosting, more complex

## What I Used AI For

### 1. Code Generation ✅
- Initial boilerplate for React components
- Express route structure
- API integration patterns
**What I Checked:** Tested every function, verified logic, fixed bugs

### 2. Tailwind Styling 🎨
- Got suggestions for responsive classes
- Component layout ideas
**What I Checked:** Tested on mobile, tablet, desktop sizes

### 3. Documentation 📝
- Help structuring README
- Example prompts and guides
**What I Checked:** Rewrote in my own words, added specifics

## What I Checked Myself

### Testing ✅
- Manually tested every feature
- Tried edge cases (empty inputs, long text, special characters)
- Verified all API endpoints work
- Tested rate limiting behavior

### Code Quality ✅
- Reviewed all AI-generated code line by line
- Added error handling where missing
- Improved validation logic
- Fixed ESM import issues

### Security ✅
- Ensured API key is in .env (not in code)
- Added input sanitization
- Verified CORS settings
- Tested with invalid inputs

## Development Approach

**AI as Assistant:** Used AI to speed up boilerplate and get suggestions  
**Human as Driver:** Made all final decisions, tested everything, understood all code

**Time Saved:** ~40% faster with AI help  
**Code Quality:** Same or better (AI caught some edge cases I missed)

---

