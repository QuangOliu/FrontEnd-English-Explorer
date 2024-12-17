import React, { useEffect, useState } from 'react'
import './Confetti.css' // Assuming you have the CSS in this file.

const Confetti = ({ score }) => {
    useEffect(() => {
        // Initialize the confetti animation on component mount
        const confettiful = new ConfettiEffect(
            document.querySelector('.js-container')
        )

        return () => {
            clearInterval(confettiful.confettiInterval) // Clean up the confetti when the component unmounts
        }
    }, [])

    return (
        <div className="js-container container" style={{ top: '0px' }}>
            <div className="confetti-container">
                {/* Confetti animation will be rendered here */}
            </div>

            {/* Congratulatory message */}
            <div className="congratulations-message">
                <h1>Chúc Mừng Bạn Đã Hoàn Thành Bài Thi!</h1>
                <h2>
                    <strong>Điểm Số: {score}</strong>
                </h2>

                {/* Home button */}
                <button
                    className="home-btn"
                    onClick={() => (window.location.href = '/')}
                >
                    Quay Về Trang Chủ
                </button>
            </div>
        </div>
    )
}

// Confetti effect logic
class ConfettiEffect {
    constructor(el) {
        this.el = el
        this.containerEl = null

        this.confettiFrequency = 3
        this.confettiColors = [
            '#EF2964',
            '#00C09D',
            '#2D87B0',
            '#48485E',
            '#EFFF1D',
        ]
        this.confettiAnimations = ['slow', 'medium', 'fast']

        this._setupElements()
        this._renderConfetti()
    }

    _setupElements() {
        const containerEl = document.createElement('div')
        const elPosition = this.el.style.position

        if (elPosition !== 'relative' && elPosition !== 'absolute') {
            this.el.style.position = 'relative'
        }

        containerEl.classList.add('confetti-container')
        this.el.appendChild(containerEl)

        this.containerEl = containerEl
    }

    _renderConfetti() {
        this.confettiInterval = setInterval(() => {
            const confettiEl = document.createElement('div')
            const confettiSize = Math.floor(Math.random() * 3) + 7 + 'px'
            const confettiBackground =
                this.confettiColors[
                    Math.floor(Math.random() * this.confettiColors.length)
                ]
            const confettiLeft =
                Math.floor(Math.random() * this.el.offsetWidth) + 'px'
            const confettiAnimation =
                this.confettiAnimations[
                    Math.floor(Math.random() * this.confettiAnimations.length)
                ]

            confettiEl.classList.add(
                'confetti',
                'confetti--animation-' + confettiAnimation
            )
            confettiEl.style.left = confettiLeft
            confettiEl.style.width = confettiSize
            confettiEl.style.height = confettiSize
            confettiEl.style.backgroundColor = confettiBackground

            confettiEl.removeTimeout = setTimeout(function () {
                confettiEl.parentNode.removeChild(confettiEl)
            }, 3000)

            this.containerEl.appendChild(confettiEl)
        }, 25)
    }
}

export default Confetti
