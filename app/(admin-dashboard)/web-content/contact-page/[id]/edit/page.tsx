import ContactPagesForm from "@/components/web-content/contact-page/ContactPagesForm";
import { getContactPageById } from "@/apiServices/contactPageAdminService";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFoundComponent";

export default async function ContactPagesEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    let contactPage;

    try {
        const pageRes = await getContactPageById(Number(id));
        if (pageRes.success) {
            contactPage = pageRes.data;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return (
                <div className="py-8 md:py-12">
                    <ErrorComponent message={`Error fetching contact page: ${error.message}`} />
                </div>
            );
        }
    }

    if (!contactPage) {
        return (
            <div className="py-8 md:py-12">
                <NotFoundComponent message="Contact page not found." />
            </div>
        );
    }

    return (
        <ContactPagesForm
            title="Edit Contact Page"
            contactPage={contactPage}
        />
    );
}
