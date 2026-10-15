export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            {...props}
            src="/images/omnishop-logo.png"
            alt="Omnishop"
            className={`object-contain ${className}`}
        />
    );
}
