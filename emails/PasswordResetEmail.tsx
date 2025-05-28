import{
    Html,
    Head,
    Preview,
    Heading,
    Row,
    Section,
    Text,
} from "@react-email/components";

interface PasswordResetEmailProps{
    token: string
}

export default function PasswordResetEmail({ token } : PasswordResetEmailProps){
    return(
        <Html lang="en" dir="ltr">
            <Head>
                <title>Password Reset</title>
            </Head>
            <Preview>Here&apos;s your password reset link</Preview>
             <Section>
                <Row>
                    <Text>Click the link to reset your password or copy and paste to your preferred web engine :</Text>
                </Row>
                <Row>
                    http://localhost:3000/reset-password?token={token}
                </Row>
            </Section> 
        </Html>
    );
}