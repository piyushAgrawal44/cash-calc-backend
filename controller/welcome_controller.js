export const welcome = async (req, res) => {
    try {
       res.status(201).send("<h1>I am glad that you are here !</h1>")
    } catch (error) {
        return res.status(501).json({ success: false, message: error.message })
    }
};