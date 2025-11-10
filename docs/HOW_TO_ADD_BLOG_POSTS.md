# How to Add Blog Posts (Simple JSON Method)

## 📝 Overview

Your blog uses a simple JSON file instead of a complex CMS. To add a new blog post, just edit one file!

**File to edit**: `src/data/posts.json`

---

## ✏️ Adding a New Blog Post

### Step 1: Open the File

```bash
# Open in your editor
code src/data/posts.json
# or
nano src/data/posts.json
# or
vim src/data/posts.json
```

### Step 2: Copy This Template

Add this to the **top** of the array (after the opening `[`):

```json
{
  "id": "4",
  "title": "Your Blog Post Title",
  "slug": "your-blog-post-slug",
  "excerpt": "A short description that appears on the blog list page.",
  "content": "# Your Post Title\n\nYour full blog post content here.\n\n## You can use Markdown!\n\n- Bullet points\n- **Bold text**\n- *Italic text*\n- [Links](https://example.com)\n\n```javascript\n// Code blocks work too!\nconsole.log('Hello!');\n```",
  "cover_image": null,
  "tags": ["tag1", "tag2"],
  "published": true,
  "published_at": "2025-11-10T00:00:00Z",
  "author": {
    "name": "AxoGM",
    "avatar": null
  },
  "created_at": "2025-11-10T00:00:00Z",
  "updated_at": "2025-11-10T00:00:00Z"
},
```

**Don't forget the comma** at the end (unless it's the last item)!

---

## 📋 Field Explanations

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Unique number (increment from last post) | `"4"`, `"5"`, etc. |
| `title` | Post title (shows everywhere) | `"My Awesome Post"` |
| `slug` | URL-friendly version (lowercase, hyphens) | `"my-awesome-post"` |
| `excerpt` | Short summary (1-2 sentences) | `"Learn how to..."` |
| `content` | Full post content (use `\n` for newlines) | `"# Title\n\nContent..."` |
| `cover_image` | Image URL or `null` | `null` or `"https://..."` |
| `tags` | Array of tags | `["react", "tutorial"]` |
| `published` | Show on site? | `true` or `false` |
| `published_at` | Publish date (YYYY-MM-DD) | `"2025-11-10T00:00:00Z"` |
| `author.name` | Your name | `"AxoGM"` |

---

## 🎨 Writing Content (Markdown Guide)

### Headings

```
# Big Heading (H1)
## Medium Heading (H2)
### Small Heading (H3)
```

### Text Formatting

```
**Bold text**
*Italic text*
~~Strikethrough~~
```

### Lists

```markdown
- Bullet point 1
- Bullet point 2

1. Numbered list
2. Item two
```

### Links

```markdown
[Link text](https://example.com)
```

### Code

Inline: \`code\`

Block:
\`\`\`javascript
const hello = "world";
\`\`\`

### Quotes

```markdown
> This is a quote
```

---

## 🔧 Important Notes

### Escaping Special Characters

In JSON, you need to escape:
- `"` → `\"`
- `\` → `\\`
- Newlines → `\n`

### Example Content with Escaping

```json
"content": "# Hello World\n\nThis is a \"quote\".\n\nHere's a backslash: \\."
```

### Creating Slugs

Slug should be:
- Lowercase
- No spaces (use hyphens)
- No special characters
- Unique!

**Examples**:
- Title: `"My First Post"` → Slug: `"my-first-post"`
- Title: `"React Tips & Tricks"` → Slug: `"react-tips-and-tricks"`

---

## 📅 Publishing Posts

### Draft (Not Visible)

```json
"published": false
```

### Published (Visible on Site)

```json
"published": true,
"published_at": "2025-11-10T00:00:00Z"
```

The `published_at` date is what shows on your blog!

---

## 🧪 Testing Your Changes

### Step 1: Save the File

Save `src/data/posts.json`

### Step 2: Test Locally

```bash
# Build to check for errors
npm run build

# If build passes, start dev server
npm run dev
```

### Step 3: View in Browser

Open `http://localhost:5173/blog`

You should see your new post!

---

## 📤 Publishing to Production

### Step 1: Commit to Git

```bash
git add src/data/posts.json
git commit -m "Add new blog post: Your Title"
git push
```

### Step 2: Vercel Auto-Deploys

Vercel will automatically:
- Detect the push
- Build your site
- Deploy to production

**Done!** Your post is live in ~2 minutes! 🎉

---

## ✏️ Editing Existing Posts

1. Open `src/data/posts.json`
2. Find the post by `slug` or `title`
3. Edit the content
4. Save, build, and deploy!

---

## 🗑️ Deleting Posts

### Option 1: Hide (Recommended)

Set `published: false` - post stays in file but hidden

### Option 2: Delete

Remove the entire JSON object (don't forget to fix commas!)

---

## 🎯 Example: Complete Post

```json
{
  "id": "5",
  "title": "10 JavaScript Tips for Beginners",
  "slug": "10-javascript-tips-beginners",
  "excerpt": "Essential JavaScript tips every beginner should know to write better code.",
  "content": "# 10 JavaScript Tips for Beginners\n\nStarting with JavaScript? Here are 10 tips to help you!\n\n## 1. Use const and let\n\nAvoid `var`. Use:\n- `const` for values that won't change\n- `let` for values that will change\n\n```javascript\nconst name = \"John\"; // won't change\nlet age = 25; // might change\n```\n\n## 2. Learn Array Methods\n\n`.map()`, `.filter()`, `.reduce()` are super useful!\n\n```javascript\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\n// Result: [2, 4, 6, 8, 10]\n```\n\n## Conclusion\n\nPractice these tips and you'll write better JavaScript in no time!\n\n**What's your favorite JavaScript tip? Let me know in the comments!**",
  "cover_image": null,
  "tags": ["javascript", "tutorial", "beginners"],
  "published": true,
  "published_at": "2025-11-11T00:00:00Z",
  "author": {
    "name": "AxoGM",
    "avatar": null
  },
  "created_at": "2025-11-11T00:00:00Z",
  "updated_at": "2025-11-11T00:00:00Z"
}
```

---

## 🆘 Troubleshooting

### "SyntaxError: Unexpected token"

- **Issue**: Invalid JSON syntax
- **Fix**: Check for:
  - Missing commas between objects
  - Extra commas at the end
  - Unescaped quotes (`"` should be `\"`)
  - Missing brackets `[]` or braces `{}`

### "Build failed"

```bash
# Check JSON syntax
npm run build
```

The error will tell you the line number!

### Post Not Showing

- Check `"published": true`
- Check `"slug"` is unique
- Clear browser cache (Ctrl+Shift+R)

---

## 🚀 That's It!

No database, no external CMS, no complicated setup. Just edit a JSON file and deploy!

**Want to add images?**
- Upload to `public/images/`
- Reference as: `"/images/your-image.jpg"`
- Or use external URLs: `"https://example.com/image.jpg"`

Happy blogging! ✨
