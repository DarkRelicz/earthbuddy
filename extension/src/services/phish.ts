const API_URL = 'https://phishtank.vercel.app/api/';

const isValidUrl = (url: string): boolean => {
    try {
        const urlObj = new URL(url)
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
        return false
    }
}


const pollResults = async (uuid: string, retry = true, delay = 2000): Promise<any> => {
    let attempts = 0
    const maxAttempts = 15 // Maximum 30 seconds with 2 second intervals

    while (retry && attempts < maxAttempts) {
        try {
            const response = await fetch(`${API_URL}/scan-result`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uuid })
            })

            if (response.status === 404) {
                attempts++
                await new Promise(resolve => setTimeout(resolve, delay))
                continue
            }

            if (response.status === 200) {
                return await response.json()
            }

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Result fetch failed')
            }

        } catch (error) {
            attempts++
            if (attempts >= maxAttempts) {
                throw new Error('Scan timed out')
            }
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }

    throw new Error('Scan timed out')
}


export const scanURL = async (url: string) => {
    if (!isValidUrl(url)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/scan-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url
            })
        })

        if (response.ok) {
            const { uuid } = await response.json()
            const result = await pollResults(uuid)
            return result;
        } else {
            const err = await response.json()
            console.error('API Error:', err.error)
            throw new Error(`Submission failed: ${err.error}`)
        }
    } catch (err) {
        console.error('Scan error:', err);
    }
};