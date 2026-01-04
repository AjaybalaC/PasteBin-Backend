import PasteModel from "../models/Paste.model.js";
import { nanoid } from "nanoid";
import getNow from "../utils/getNow.js";

//POST /pastes

export const createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: "content is required" })
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return res.status(400).json({ error: "ttl_seconds must be >= 1" })
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return res.status(400).json({ error: "max_views must be >= 1" })
    }

    const now = getNow(req)
    const expiresAt = ttl_seconds
      ? new Date(now.getTime() + ttl_seconds * 1000)
      : null

    const paste = await PasteModel.create({
      content,
      expiresAt,
      maxViews: max_views ?? null
    })

    res.status(201).json({
      id: paste._id.toString(),
      url: `${req.protocol}://${req.get('host')}/p/${paste._id}`
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal server error" })
  }
}

// GET /api/pastes/:id

export const getPaste = async (req, res) => {
  try {
    const paste = await PasteModel.findById(req.params.id)

    if (!paste) {
      return res.status(404).json({ error: "Paste not found" })
    }

    const now = getNow(req)

    if (paste.expiresAt && now >= paste.expiresAt) {
      return res.status(404).json({ error: "Paste expired" })
    }

    if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
      return res.status(404).json({ error: "View limit exceeded" })
    }

    paste.viewCount += 1
    await paste.save()

    res.json({
      content: paste.content,
      remaining_views:
        paste.maxViews !== null ? paste.maxViews - paste.viewCount : null,
      expires_at: paste.expiresAt
    })
  } catch {
    res.status(404).json({ error: "Invalid paste id" })
  }
}


// GET /p/:id

export const viewPasteHTML = async (req, res) => {
  try {
    const paste = await PasteModel.findById(req.params.id)

    if (!paste) {
      return res.status(404).send('Not Found')
    }

    const now = getNow(req)

    if (paste.expiresAt && now >= paste.expiresAt) {
      return res.status(404).send('Not Found')
    }

    if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
      return res.status(404).send('Not Found')
    }

    paste.viewCount += 1
    await paste.save()

    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Paste</title>
        </head>
        <body>
          <pre>${escapeHtml(paste.content)}</pre>
        </body>
      </html>
    `)
  } catch {
    res.status(404).send('Not Found')
  }
}

const escapeHtml = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")